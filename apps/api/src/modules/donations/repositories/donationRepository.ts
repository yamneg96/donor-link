import { Donation, IDonation } from '../models/Donation';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class DonationRepository {
  async findById(id: string): Promise<IDonation | null> { return Donation.findOne({ _id: id, isDeleted: false }).populate('donorId').populate('organizationId', 'name code').populate('staffId', 'firstName lastName'); }
  async findAll(filters: Record<string, unknown>, pagination: PaginationParams) {
    const query = { isDeleted: false, ...filters };
    const [donations, total] = await Promise.all([
      Donation.find(query).populate('donorId').populate('organizationId', 'name code').populate('staffId', 'firstName lastName').sort(buildSortObject(pagination)).skip(getSkip(pagination)).limit(pagination.limit),
      Donation.countDocuments(query),
    ]);
    return { donations, total };
  }
  async create(data: Partial<IDonation>): Promise<IDonation> { return Donation.create(data); }
  async update(id: string, data: Partial<IDonation>): Promise<IDonation | null> { return Donation.findByIdAndUpdate(id, data, { new: true }); }
  async addBloodUnitRef(donationId: string, unitId: string): Promise<void> { await Donation.findByIdAndUpdate(donationId, { $push: { bloodUnitsCreated: unitId } }); }
  async countByOrganization(orgId: string, startDate?: Date, endDate?: Date): Promise<number> {
    const query: Record<string, unknown> = { organizationId: orgId, isDeleted: false };
    if (startDate && endDate) query.collectionDate = { $gte: startDate, $lte: endDate };
    return Donation.countDocuments(query);
  }
}
