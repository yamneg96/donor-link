import { Donor, IDonor } from '../models/Donor';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class DonorRepository {
  async findById(id: string): Promise<IDonor | null> { return Donor.findOne({ _id: id, isDeleted: false }).populate('userId', 'firstName lastName email phone'); }
  async findByUserId(userId: string): Promise<IDonor | null> { return Donor.findOne({ userId, isDeleted: false }); }
  async findAll(filters: Record<string, unknown>, pagination: PaginationParams) {
    const query = { isDeleted: false, ...filters };
    const [donors, total] = await Promise.all([
      Donor.find(query).populate('userId', 'firstName lastName email phone').sort(buildSortObject(pagination)).skip(getSkip(pagination)).limit(pagination.limit),
      Donor.countDocuments(query),
    ]);
    return { donors, total };
  }
  async create(data: Partial<IDonor>): Promise<IDonor> { return Donor.create(data); }
  async update(id: string, data: Partial<IDonor>): Promise<IDonor | null> { return Donor.findByIdAndUpdate(id, data, { new: true }).populate('userId', 'firstName lastName email phone'); }
  async softDelete(id: string): Promise<void> { await Donor.findByIdAndUpdate(id, { isDeleted: true }); }
  async findEligibleByBloodType(bloodType: string, coordinates?: [number, number], maxDistanceKm?: number): Promise<IDonor[]> {
    const query: Record<string, unknown> = { isDeleted: false, isEligible: true, isAvailable: true, bloodType };
    if (coordinates && maxDistanceKm) {
      query.location = { $near: { $geometry: { type: 'Point', coordinates }, $maxDistance: maxDistanceKm * 1000 } };
    }
    return Donor.find(query).populate('userId', 'firstName lastName email phone').limit(50);
  }
  async countByBloodType(): Promise<Record<string, number>> {
    const result = await Donor.aggregate([{ $match: { isDeleted: false } }, { $group: { _id: '$bloodType', count: { $sum: 1 } } }]);
    const counts: Record<string, number> = {};
    result.forEach((r: { _id: string; count: number }) => { counts[r._id] = r.count; });
    return counts;
  }
  async incrementDonationCount(id: string, donationDate: Date): Promise<void> {
    const nextEligible = new Date(donationDate);
    nextEligible.setDate(nextEligible.getDate() + 56);
    await Donor.findByIdAndUpdate(id, { $inc: { totalDonations: 1 }, lastDonationDate: donationDate, nextEligibleDate: nextEligible, isEligible: false });
  }
}
