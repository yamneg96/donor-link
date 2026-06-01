import { DonorEngagement, IDonorEngagement } from '../models/DonorEngagement';

export class EngagementRepository {
  async findByDonor(donorId: string): Promise<IDonorEngagement | null> {
    return DonorEngagement.findOne({ donorId, isDeleted: false });
  }

  async upsertByDonor(donorId: string, data: Partial<IDonorEngagement>): Promise<IDonorEngagement> {
    return DonorEngagement.findOneAndUpdate(
      { donorId },
      { ...data, donorId },
      { new: true, upsert: true }
    ) as Promise<IDonorEngagement>;
  }

  async updateByDonor(donorId: string, data: Partial<IDonorEngagement>): Promise<IDonorEngagement | null> {
    return DonorEngagement.findOneAndUpdate({ donorId }, data, { new: true });
  }

  async addBadge(donorId: string, badge: Record<string, any>): Promise<IDonorEngagement | null> {
    return DonorEngagement.findOneAndUpdate(
      { donorId },
      { $push: { badges: badge } },
      { new: true }
    );
  }

  async addMilestone(donorId: string, milestone: Record<string, any>): Promise<IDonorEngagement | null> {
    return DonorEngagement.findOneAndUpdate(
      { donorId },
      { $push: { milestones: milestone } },
      { new: true }
    );
  }

  async incrementStats(donorId: string, stats: Record<string, number>): Promise<IDonorEngagement | null> {
    return DonorEngagement.findOneAndUpdate(
      { donorId },
      { $inc: stats },
      { new: true }
    );
  }

  async getLeaderboard(limit: number = 20, sortBy: string = 'estimatedLivesSaved') {
    return DonorEngagement.find({ isDeleted: false })
      .populate('donorId', 'firstName lastName bloodType')
      .sort({ [sortBy]: -1 })
      .limit(limit);
  }

  async getTopDonors(limit: number = 10) {
    return DonorEngagement.find({ isDeleted: false })
      .populate('donorId', 'firstName lastName bloodType')
      .sort({ totalDonations: -1 })
      .limit(limit);
  }

  async getGlobalStats() {
    return DonorEngagement.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: null,
          totalDonors: { $sum: 1 },
          totalDonations: { $sum: '$totalDonations' },
          totalLivesSaved: { $sum: '$estimatedLivesSaved' },
          totalVolumeMl: { $sum: '$totalVolumeMl' },
          avgDonationsPerDonor: { $avg: '$totalDonations' },
        },
      },
    ]);
  }
}
