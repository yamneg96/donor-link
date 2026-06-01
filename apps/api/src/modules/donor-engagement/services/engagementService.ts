import { EngagementRepository } from '../repositories/engagementRepository';
import { BadgeCategory } from '../models/DonorEngagement';
import { NotFoundError } from '../../../core/errors';

const RANK_THRESHOLDS = [
  { min: 0, rank: 'Bronze', points: 0 },
  { min: 3, rank: 'Silver', points: 100 },
  { min: 10, rank: 'Gold', points: 500 },
  { min: 25, rank: 'Platinum', points: 1500 },
  { min: 50, rank: 'Diamond', points: 5000 },
  { min: 100, rank: 'Legend', points: 10000 },
];

const DONATION_BADGES = [
  { count: 1, badgeId: 'first_drop', name: 'First Drop', description: 'Completed your first donation', icon: '💧' },
  { count: 5, badgeId: 'regular_hero', name: 'Regular Hero', description: '5 donations completed', icon: '🦸' },
  { count: 10, badgeId: 'life_saver', name: 'Life Saver', description: '10 donations — estimated 30 lives saved', icon: '❤️' },
  { count: 25, badgeId: 'blood_champion', name: 'Blood Champion', description: '25 donations milestone', icon: '🏆' },
  { count: 50, badgeId: 'platinum_donor', name: 'Platinum Donor', description: '50 donations — extraordinary impact', icon: '💎' },
  { count: 100, badgeId: 'legend', name: 'Century Legend', description: '100 donations — legendary donor', icon: '👑' },
];

export class EngagementService {
  private repo = new EngagementRepository();

  async getOrCreateProfile(donorId: string) {
    let profile = await this.repo.findByDonor(donorId);
    if (!profile) {
      profile = await this.repo.upsertByDonor(donorId, { donorSince: new Date() });
    }
    return profile;
  }

  async getDonorStats(donorId: string) {
    const profile = await this.getOrCreateProfile(donorId);
    return {
      totalDonations: profile.totalDonations,
      estimatedLivesSaved: profile.estimatedLivesSaved,
      currentStreak: profile.currentStreak,
      longestStreak: profile.longestStreak,
      loyaltyPoints: profile.loyaltyPoints,
      rank: profile.rank,
      badgeCount: profile.badges.length,
      campaignsParticipated: profile.campaignsParticipated,
      emergencyResponses: profile.emergencyResponses,
      donorSince: profile.donorSince,
      nextEligibleDate: profile.nextEligibleDate,
    };
  }

  async recordDonation(donorId: string, volumeMl: number = 450) {
    const profile = await this.getOrCreateProfile(donorId);
    const LIVES_PER_DONATION = 3;

    // Update streak
    let newStreak = 1;
    if (profile.lastDonationDate) {
      const daysSinceLast = Math.floor((Date.now() - profile.lastDonationDate.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLast <= 120) { // within ~4 months
        newStreak = profile.currentStreak + 1;
      }
    }

    const longestStreak = Math.max(newStreak, profile.longestStreak);
    const nextEligibleDate = new Date();
    nextEligibleDate.setDate(nextEligibleDate.getDate() + 56);

    await this.repo.updateByDonor(donorId, {
      totalDonations: profile.totalDonations + 1,
      totalVolumeMl: profile.totalVolumeMl + volumeMl,
      estimatedLivesSaved: profile.estimatedLivesSaved + LIVES_PER_DONATION,
      currentStreak: newStreak,
      longestStreak,
      lastDonationDate: new Date(),
      nextEligibleDate,
      loyaltyPoints: profile.loyaltyPoints + 50,
    });

    // Calculate rank
    const newTotal = profile.totalDonations + 1;
    const newRank = this.calculateRank(newTotal);
    if (newRank !== profile.rank) {
      await this.repo.updateByDonor(donorId, { rank: newRank });
    }

    // Award badges
    await this.checkAndAwardDonationBadges(donorId, newTotal);

    // Add milestone
    if ([1, 5, 10, 25, 50, 100].includes(newTotal)) {
      await this.repo.addMilestone(donorId, {
        type: 'donation_count',
        value: newTotal,
        reachedAt: new Date(),
        description: `Reached ${newTotal} donation${newTotal > 1 ? 's' : ''}`,
      });
    }

    return this.repo.findByDonor(donorId);
  }

  async recordEmergencyResponse(donorId: string) {
    const profile = await this.getOrCreateProfile(donorId);
    await this.repo.incrementStats(donorId, { emergencyResponses: 1, loyaltyPoints: 100 });

    if (profile.emergencyResponses + 1 === 1) {
      await this.repo.addBadge(donorId, {
        badgeId: 'emergency_responder',
        name: 'Emergency Responder',
        description: 'Responded to a blood emergency',
        category: BadgeCategory.EMERGENCY_RESPONSE,
        icon: '🚨',
        earnedAt: new Date(),
      });
    }
  }

  async recordCampaignParticipation(donorId: string) {
    await this.getOrCreateProfile(donorId);
    await this.repo.incrementStats(donorId, { campaignsParticipated: 1, loyaltyPoints: 30 });
  }

  async getImpactMetrics(donorId: string) {
    const profile = await this.getOrCreateProfile(donorId);
    return {
      livesSaved: profile.estimatedLivesSaved,
      totalDonations: profile.totalDonations,
      totalVolumeLiters: (profile.totalVolumeMl / 1000).toFixed(1),
      rank: profile.rank,
      streak: profile.currentStreak,
      badges: profile.badges,
      milestones: profile.milestones,
    };
  }

  async getBadges(donorId: string) {
    const profile = await this.getOrCreateProfile(donorId);
    return profile.badges;
  }

  async getLeaderboard(limit: number = 20, sortBy: string = 'estimatedLivesSaved') {
    return this.repo.getLeaderboard(limit, sortBy);
  }

  async getGlobalStats() {
    const stats = await this.repo.getGlobalStats();
    return stats[0] || {
      totalDonors: 0,
      totalDonations: 0,
      totalLivesSaved: 0,
      totalVolumeMl: 0,
      avgDonationsPerDonor: 0,
    };
  }

  private calculateRank(totalDonations: number): string {
    let rank = 'Bronze';
    for (const threshold of RANK_THRESHOLDS) {
      if (totalDonations >= threshold.min) {
        rank = threshold.rank;
      }
    }
    return rank;
  }

  private async checkAndAwardDonationBadges(donorId: string, totalDonations: number) {
    const profile = await this.repo.findByDonor(donorId);
    if (!profile) return;

    const existingBadgeIds = new Set(profile.badges.map(b => b.badgeId));

    for (const badge of DONATION_BADGES) {
      if (totalDonations >= badge.count && !existingBadgeIds.has(badge.badgeId)) {
        await this.repo.addBadge(donorId, {
          badgeId: badge.badgeId,
          name: badge.name,
          description: badge.description,
          category: BadgeCategory.DONATION_COUNT,
          icon: badge.icon,
          earnedAt: new Date(),
        });
      }
    }
  }
}
