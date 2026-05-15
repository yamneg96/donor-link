import { TransferRepository } from '../repositories/transferRepository';
import { NotFoundError, AppError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';
import { TransferStatus, BloodUnitStatus, InventoryAction } from '../../../core/constants';
import { eventBus, EventType } from '../../../core/events';
import { BloodUnit } from '../../inventory/models/BloodUnit';
import { InventoryLedger } from '../../inventory/models/InventoryLedger';

export class TransferService {
  private repo = new TransferRepository();

  async getById(id: string) { const t = await this.repo.findById(id); if (!t) throw new NotFoundError('Transfer'); return t; }
  async getAll(filters: Record<string, unknown>, pagination: PaginationParams) { return this.repo.findAll(filters, pagination); }

  async create(data: Record<string, unknown>) {
    const transfer = await this.repo.create(data);
    eventBus.emitEvent(EventType.TRANSFER_REQUESTED, { transferId: transfer._id.toString(), fromOrg: data.fromOrgId, toOrg: data.toOrgId });
    return transfer;
  }

  async approve(id: string, userId: string) {
    const transfer = await this.repo.findById(id);
    if (!transfer) throw new NotFoundError('Transfer');
    if (transfer.status !== TransferStatus.PENDING) throw new AppError('Transfer cannot be approved in current status', 400);
    return this.repo.update(id, { status: TransferStatus.APPROVED, approvedBy: userId as any, approvedAt: new Date() } as any);
  }

  async reject(id: string, userId: string, reason: string) {
    const transfer = await this.repo.findById(id);
    if (!transfer) throw new NotFoundError('Transfer');
    if (transfer.status !== TransferStatus.PENDING) throw new AppError('Transfer cannot be rejected in current status', 400);
    return this.repo.update(id, { status: TransferStatus.REJECTED, rejectedBy: userId as any, rejectionReason: reason } as any);
  }

  async dispatch(id: string, shipmentData: Record<string, unknown>, userId: string) {
    const transfer = await this.repo.findById(id);
    if (!transfer) throw new NotFoundError('Transfer');
    if (transfer.status !== TransferStatus.APPROVED) throw new AppError('Transfer must be approved before dispatch', 400);

    // Update blood units status
    for (const unitId of transfer.bloodUnits) {
      await BloodUnit.findByIdAndUpdate(unitId, { status: BloodUnitStatus.TRANSFERRED });
      await InventoryLedger.create({
        bloodUnitId: unitId, action: InventoryAction.TRANSFERRED_OUT, organizationId: transfer.fromOrgId,
        performedBy: userId, metadata: { transferId: id, toOrg: transfer.toOrgId },
      });
    }

    const shipment = await this.repo.createShipment({ ...shipmentData, transferRequestId: transfer._id, dispatchedBy: userId as any } as any);
    await this.repo.update(id, { status: TransferStatus.DISPATCHED } as any);

    eventBus.emitEvent(EventType.TRANSFER_DISPATCHED, { transferId: id });
    return { transfer: await this.repo.findById(id), shipment };
  }

  async receive(id: string, userId: string) {
    const transfer = await this.repo.findById(id);
    if (!transfer) throw new NotFoundError('Transfer');

    // Update blood units to new organization
    for (const unitId of transfer.bloodUnits) {
      await BloodUnit.findByIdAndUpdate(unitId, { status: BloodUnitStatus.AVAILABLE, currentHospitalId: transfer.toOrgId, organizationId: transfer.toOrgId });
      await InventoryLedger.create({
        bloodUnitId: unitId, action: InventoryAction.TRANSFERRED_IN, organizationId: transfer.toOrgId,
        performedBy: userId, metadata: { transferId: id, fromOrg: transfer.fromOrgId },
      });
    }

    await this.repo.update(id, { status: TransferStatus.COMPLETED } as any);

    // Update shipment
    const shipment = await this.repo.findShipmentByTransfer(id);
    if (shipment) await this.repo.updateShipment(shipment._id.toString(), { status: 'delivered', actualArrival: new Date() } as any);

    eventBus.emitEvent(EventType.TRANSFER_COMPLETED, { transferId: id, fromOrg: transfer.fromOrgId.toString(), toOrg: transfer.toOrgId.toString() });
    return this.repo.findById(id);
  }

  async cancel(id: string) {
    return this.repo.update(id, { status: TransferStatus.CANCELLED } as any);
  }

  async getShipment(transferId: string) {
    return this.repo.findShipmentByTransfer(transferId);
  }

  async addTracking(transferId: string, update: Record<string, unknown>) {
    const shipment = await this.repo.findShipmentByTransfer(transferId);
    if (!shipment) throw new NotFoundError('Shipment');
    await this.repo.addTrackingUpdate(shipment._id.toString(), update);
    return this.repo.findShipmentByTransfer(transferId);
  }
}
