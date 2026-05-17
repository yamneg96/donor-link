import { InventoryRepository } from '../repositories/inventoryRepository';
import { NotFoundError, AppError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';
import { eventBus, EventType } from '../../../core/events';
import { BloodUnitStatus, InventoryAction, OrganizationType } from '../../../core/constants';
import { generateBarcode, generateQRCode } from '../../../core/utils';
import { Organization } from '../../organizations/models/Organization';

export class InventoryService {
  private repo = new InventoryRepository();

  async getUnitById(id: string) {
    const unit = await this.repo.findUnitById(id);
    if (!unit) throw new NotFoundError('Blood Unit');
    return unit;
  }

  async getUnitByBarcode(barcode: string) {
    const unit = await this.repo.findUnitByBarcode(barcode);
    if (!unit) throw new NotFoundError('Blood Unit');
    return unit;
  }

  async getAllUnits(filters: Record<string, unknown>, pagination: PaginationParams) {
    return this.repo.findUnits(filters, pagination);
  }

  async getStockLevels(organizationId?: string) {
    if (organizationId) return this.repo.getStockLevels(organizationId);
    return this.repo.getNationalStockLevels();
  }

  async getStockByOrganization() {
    return this.repo.getStockByOrganization();
  }

  async reserveUnit(unitId: string, requestId: string, userId: string) {
    const unit = await this.repo.reserveUnit(unitId, requestId);
    if (!unit) throw new AppError('Unit not available for reservation', 400, 'UNIT_NOT_AVAILABLE');

    await this.repo.addLifecycleEntry(unitId, {
      status: BloodUnitStatus.RESERVED, timestamp: new Date(), performedBy: userId, notes: `Reserved for request ${requestId}`,
    });

    await this.repo.createLedgerEntry({
      bloodUnitId: unit._id, action: InventoryAction.RESERVED, organizationId: unit.currentHospitalId,
      performedBy: userId as any, previousStatus: BloodUnitStatus.AVAILABLE, newStatus: BloodUnitStatus.RESERVED,
      metadata: { requestId },
    });

    return unit;
  }

  async releaseReservation(unitId: string, userId: string) {
    const unit = await this.repo.releaseReservation(unitId);
    if (!unit) throw new AppError('Unit not reserved', 400, 'UNIT_NOT_RESERVED');

    await this.repo.addLifecycleEntry(unitId, {
      status: BloodUnitStatus.AVAILABLE, timestamp: new Date(), performedBy: userId, notes: 'Reservation released',
    });

    return unit;
  }

  async markAsUsed(unitId: string, userId: string) {
    const unit = await this.repo.findUnitById(unitId);
    if (!unit) throw new NotFoundError('Blood Unit');
    if (unit.status !== BloodUnitStatus.RESERVED && unit.status !== BloodUnitStatus.AVAILABLE) {
      throw new AppError('Unit cannot be marked as used', 400, 'INVALID_STATUS');
    }

    const updated = await this.repo.updateUnit(unitId, { status: BloodUnitStatus.USED, usedAt: new Date() });

    await this.repo.addLifecycleEntry(unitId, {
      status: BloodUnitStatus.USED, timestamp: new Date(), performedBy: userId, notes: 'Unit used',
    });

    await this.repo.createLedgerEntry({
      bloodUnitId: unit._id, action: InventoryAction.USED, organizationId: unit.currentHospitalId,
      performedBy: userId as any, previousStatus: unit.status, newStatus: BloodUnitStatus.USED,
    });

    eventBus.emitEvent(EventType.BLOOD_UNIT_USED, { unitId, bloodType: unit.bloodType, organizationId: unit.currentHospitalId.toString() });

    return updated;
  }

  async markAsExpired(unitId: string, userId: string) {
    const unit = await this.repo.findUnitById(unitId);
    if (!unit) throw new NotFoundError('Blood Unit');

    const updated = await this.repo.updateUnit(unitId, { status: BloodUnitStatus.EXPIRED });

    await this.repo.addLifecycleEntry(unitId, {
      status: BloodUnitStatus.EXPIRED, timestamp: new Date(), performedBy: userId, notes: 'Unit expired',
    });

    await this.repo.createLedgerEntry({
      bloodUnitId: unit._id, action: InventoryAction.EXPIRED, organizationId: unit.currentHospitalId,
      performedBy: userId as any, previousStatus: unit.status, newStatus: BloodUnitStatus.EXPIRED,
    });

    eventBus.emitEvent(EventType.BLOOD_UNIT_EXPIRED, { unitId, bloodType: unit.bloodType, organizationId: unit.currentHospitalId.toString() });

    return updated;
  }

  async discardUnit(unitId: string, reason: string, userId: string) {
    const unit = await this.repo.findUnitById(unitId);
    if (!unit) throw new NotFoundError('Blood Unit');

    const updated = await this.repo.updateUnit(unitId, { status: BloodUnitStatus.DISCARDED, discardReason: reason });

    await this.repo.addLifecycleEntry(unitId, {
      status: BloodUnitStatus.DISCARDED, timestamp: new Date(), performedBy: userId, notes: `Discarded: ${reason}`,
    });

    await this.repo.createLedgerEntry({
      bloodUnitId: unit._id, action: InventoryAction.DISCARDED, organizationId: unit.currentHospitalId,
      performedBy: userId as any, previousStatus: unit.status, newStatus: BloodUnitStatus.DISCARDED,
      metadata: { reason },
    });

    return updated;
  }

  async getExpiringUnits(thresholdDays: number = 3) {
    return this.repo.findExpiringUnits(thresholdDays);
  }

  async getUnitLedger(unitId: string) {
    return this.repo.getLedgerForUnit(unitId);
  }

  async getOrganizationLedger(organizationId: string, pagination: PaginationParams) {
    return this.repo.getLedgerByOrganization(organizationId, pagination);
  }

  async getInventoryStats(organizationId?: string) {
    return this.repo.countByStatus(organizationId);
  }

  async createUnit(data: Record<string, unknown>, userId: string, userOrgId?: string) {
    const barcode = (data.barcode as string) || generateBarcode();
    const qrCode = generateQRCode();
    
    let organizationId = userOrgId || data.organizationId;
    if (!organizationId) {
      const org = await Organization.findOne({ type: OrganizationType.NATIONAL_BLOOD_BANK }) || await Organization.findOne();
      if (org) organizationId = org._id;
    }
    if (!organizationId) {
      throw new AppError('Organization ID is required', 400);
    }
    
    const unit = await this.repo.createUnit({
      ...data,
      barcode,
      qrCode,
      organizationId: organizationId as any,
      currentHospitalId: organizationId as any,
      status: BloodUnitStatus.AVAILABLE,
      donationId: (data.donationId as any) || new (require('mongoose').Types.ObjectId)(),
      donorId: (data.donorId as any) || new (require('mongoose').Types.ObjectId)(),
      lifecycleHistory: [{
        status: BloodUnitStatus.AVAILABLE,
        timestamp: new Date(),
        performedBy: userId as any,
        notes: (data.notes as string) || 'Manual entry registration',
      }]
    } as any);
    
    await this.repo.createLedgerEntry({
      bloodUnitId: unit._id,
      action: InventoryAction.AVAILABLE,
      organizationId: organizationId as any,
      performedBy: userId as any,
      newStatus: BloodUnitStatus.AVAILABLE,
      notes: 'Manual entry registration',
    });
    
    eventBus.emitEvent(EventType.BLOOD_UNIT_CREATED, { unitId: unit._id.toString(), bloodType: unit.bloodType });
    
    return unit;
  }
}
