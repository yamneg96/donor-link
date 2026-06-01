import { z } from 'zod';

export const recordDonationSchema = z.object({
  volumeMl: z.number().min(100).max(1000).optional(),
});

export const leaderboardQuerySchema = z.object({
  limit: z.string().transform(Number).optional(),
  sortBy: z.enum(['estimatedLivesSaved', 'totalDonations', 'loyaltyPoints', 'currentStreak']).optional(),
});

export type RecordDonationInput = z.infer<typeof recordDonationSchema>;
