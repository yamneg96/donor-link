import { EligibilityRecord, IEligibilityRecord, EligibilityStatus, RestrictionType } from '../models/EligibilityRecord';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class EligibilityRepository {
  async create(data: Partial<IEligibilityRecord>): Promise<IEligibilityRecord> {
    return EligibilityRecord.create(data);
  }

  async findById(id: string): Promise<IEligibilityRecord | null> {
    return EligibilityRecord.findOne({ _id: id, isDeleted: false })
      .populate('donorId', 'firstName lastName bloodType dateOfBirth')
      .populate('reviewedBy', 'firstName lastName');
  }

  async findLatestByDonor(donorId: string): Promise<IEligibilityRecord | null> {
    return EligibilityRecord.findOne({ donorId, isDeleted: false })
      .sort({ screeningDate: -1 })
      .populate('reviewedBy', 'firstName lastName');
  }

  async findByDonor(donorId: string, pagination: PaginationParams) {
    const query = { donorId, isDeleted: false };
    const [records, total] = await Promise.all([
      EligibilityRecord.find(query)
        .sort(buildSortObject(pagination))
        .skip(getSkip(pagination))
        .limit(pagination.limit),
      EligibilityRecord.countDocuments(query),
    ]);
    return { records, total };
  }

  async updateById(id: string, data: Partial<IEligibilityRecord>): Promise<IEligibilityRecord | null> {
    return EligibilityRecord.findByIdAndUpdate(id, data, { new: true });
  }

  async addRestriction(id: string, restriction: Record<string, any>): Promise<IEligibilityRecord | null> {
    return EligibilityRecord.findByIdAndUpdate(
      id,
      { $push: { restrictions: restriction } },
      { new: true }
    );
  }

  async deactivateRestriction(recordId: string, restrictionId: string): Promise<IEligibilityRecord | null> {
    return EligibilityRecord.findOneAndUpdate(
      { _id: recordId, 'restrictions._id': restrictionId },
      { $set: { 'restrictions.$.isActive': false } },
      { new: true }
    );
  }

  async getActiveRestrictions(donorId: string) {
    const record = await EligibilityRecord.findOne({ donorId, isDeleted: false })
      .sort({ screeningDate: -1 });
    if (!record) return [];
    return record.restrictions.filter(r => r.isActive);
  }

  async countByStatus() {
    return EligibilityRecord.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }
}
