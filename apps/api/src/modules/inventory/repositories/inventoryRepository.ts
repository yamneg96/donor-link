import { BloodUnit, IBloodUnit } from '../models/BloodUnit';
import { InventoryLedger, IInventoryLedger } from '../models/InventoryLedger';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';
import { BloodUnitStatus, InventoryAction } from '../../../core/constants';

export class InventoryRepository {
  // === Blood Unit Queries ===
  async findUnitById(id: string): Promise<IBloodUnit | null> {
    return BloodUnit.findOne({ _id: id, isDeleted: false }).populate('organizationId', 'name code').populate('currentHospitalId', 'name code');
  }

  async findUnitByBarcode(barcode: string): Promise<IBloodUnit | null> {
    return BloodUnit.findOne({ barcode, isDeleted: false });
  }

  async findUnits(filters: Record<string, unknown>, pagination: PaginationParams) {
    const query = { isDeleted: false, ...filters };
    const [units, total] = await Promise.all([
      BloodUnit.find(query).populate('organizationId', 'name code').populate('currentHospitalId', 'name code').sort(buildSortObject(pagination)).skip(getSkip(pagination)).limit(pagination.limit),
      BloodUnit.countDocuments(query),
    ]);
    return { units, total };
  }

  async updateUnit(id: string, data: Partial<IBloodUnit>): Promise<IBloodUnit | null> {
    return BloodUnit.findByIdAndUpdate(id, data, { new: true });
  }

  async addLifecycleEntry(unitId: string, entry: Record<string, unknown>): Promise<void> {
    await BloodUnit.findByIdAndUpdate(unitId, { $push: { lifecycleHistory: entry } });
  }

  // === Stock Level Queries ===
  async getStockLevels(organizationId: string) {
    return BloodUnit.aggregate([
      { $match: { currentHospitalId: { $eq: organizationId ? require('mongoose').Types.ObjectId.createFromHexString(organizationId) : null }, status: BloodUnitStatus.AVAILABLE, isDeleted: false } },
      { $group: { _id: { bloodType: '$bloodType', componentType: '$componentType' }, count: { $sum: 1 }, totalVolume: { $sum: '$volume' } } },
      { $sort: { '_id.bloodType': 1 } },
    ]);
  }

  async getNationalStockLevels() {
    return BloodUnit.aggregate([
      { $match: { status: BloodUnitStatus.AVAILABLE, isDeleted: false } },
      { $group: { _id: { bloodType: '$bloodType', componentType: '$componentType' }, count: { $sum: 1 }, totalVolume: { $sum: '$volume' } } },
      { $sort: { '_id.bloodType': 1 } },
    ]);
  }

  async getStockByOrganization() {
    return BloodUnit.aggregate([
      { $match: { status: BloodUnitStatus.AVAILABLE, isDeleted: false } },
      { $group: { _id: { organizationId: '$currentHospitalId', bloodType: '$bloodType' }, count: { $sum: 1 } } },
      { $lookup: { from: 'organizations', localField: '_id.organizationId', foreignField: '_id', as: 'org' } },
      { $unwind: '$org' },
      { $project: { organizationId: '$_id.organizationId', organizationName: '$org.name', bloodType: '$_id.bloodType', count: 1 } },
    ]);
  }

  // === Expiry Queries ===
  async findExpiringUnits(thresholdDays: number = 3) {
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() + thresholdDays);
    return BloodUnit.find({
      status: BloodUnitStatus.AVAILABLE,
      expiryDate: { $lte: thresholdDate, $gt: new Date() },
      isDeleted: false,
    }).populate('currentHospitalId', 'name code');
  }

  async findExpiredUnits() {
    return BloodUnit.find({
      status: BloodUnitStatus.AVAILABLE,
      expiryDate: { $lte: new Date() },
      isDeleted: false,
    });
  }

  // === Ledger ===
  async createLedgerEntry(data: Partial<IInventoryLedger>): Promise<IInventoryLedger> {
    return InventoryLedger.create(data);
  }

  async getLedgerForUnit(unitId: string) {
    return InventoryLedger.find({ bloodUnitId: unitId }).sort({ timestamp: -1 }).populate('performedBy', 'firstName lastName');
  }

  async getLedgerByOrganization(organizationId: string, pagination: PaginationParams) {
    const query = { organizationId };
    const [entries, total] = await Promise.all([
      InventoryLedger.find(query).sort({ timestamp: -1 }).skip(getSkip(pagination)).limit(pagination.limit).populate('performedBy', 'firstName lastName'),
      InventoryLedger.countDocuments(query),
    ]);
    return { entries, total };
  }

  // === Reservation ===
  async reserveUnit(unitId: string, requestId: string): Promise<IBloodUnit | null> {
    return BloodUnit.findOneAndUpdate(
      { _id: unitId, status: BloodUnitStatus.AVAILABLE },
      { status: BloodUnitStatus.RESERVED, reservedFor: requestId, reservedAt: new Date() },
      { new: true }
    );
  }

  async releaseReservation(unitId: string): Promise<IBloodUnit | null> {
    return BloodUnit.findOneAndUpdate(
      { _id: unitId, status: BloodUnitStatus.RESERVED },
      { status: BloodUnitStatus.AVAILABLE, reservedFor: null, reservedAt: null },
      { new: true }
    );
  }

  // === Stats ===
  async countByStatus(organizationId?: string) {
    const match: Record<string, unknown> = { isDeleted: false };
    if (organizationId) match.currentHospitalId = require('mongoose').Types.ObjectId.createFromHexString(organizationId);
    return BloodUnit.aggregate([
      { $match: match },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }
}
