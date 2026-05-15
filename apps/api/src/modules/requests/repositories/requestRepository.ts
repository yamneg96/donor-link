import { BloodRequest, IBloodRequest } from '../models/BloodRequest';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class RequestRepository {
  async findById(id: string): Promise<IBloodRequest | null> {
    return BloodRequest.findOne({ _id: id, isDeleted: false }).populate('requestingOrgId', 'name code').populate('requestedBy', 'firstName lastName').populate('fulfilledUnits');
  }
  async findAll(filters: Record<string, unknown>, pagination: PaginationParams) {
    const query = { isDeleted: false, ...filters };
    const [requests, total] = await Promise.all([
      BloodRequest.find(query).populate('requestingOrgId', 'name code').populate('requestedBy', 'firstName lastName').sort(buildSortObject(pagination)).skip(getSkip(pagination)).limit(pagination.limit),
      BloodRequest.countDocuments(query),
    ]);
    return { requests, total };
  }
  async create(data: Partial<IBloodRequest>): Promise<IBloodRequest> { return BloodRequest.create(data); }
  async update(id: string, data: Partial<IBloodRequest>): Promise<IBloodRequest | null> { return BloodRequest.findByIdAndUpdate(id, data, { new: true }); }
  async addFulfilledUnit(id: string, unitId: string): Promise<void> { await BloodRequest.findByIdAndUpdate(id, { $push: { fulfilledUnits: unitId } }); }
}
