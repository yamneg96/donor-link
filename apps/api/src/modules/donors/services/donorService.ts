import { DonorRepository } from '../repositories/donorRepository';
import { NotFoundError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';
import { isDonorEligible } from '../../../core/utils';

export class DonorService {
  private repo = new DonorRepository();

  async getById(id: string) { const d = await this.repo.findById(id); if (!d) throw new NotFoundError('Donor'); return d; }
  async getAll(filters: Record<string, unknown>, pagination: PaginationParams) { return this.repo.findAll(filters, pagination); }
  async create(data: Record<string, unknown>) { return this.repo.create(data); }
  async update(id: string, data: Record<string, unknown>) { const d = await this.repo.findById(id); if (!d) throw new NotFoundError('Donor'); return this.repo.update(id, data); }
  async delete(id: string) { const d = await this.repo.findById(id); if (!d) throw new NotFoundError('Donor'); await this.repo.softDelete(id); return { message: 'Donor deleted' }; }

  async checkEligibility(id: string) {
    const donor = await this.repo.findById(id);
    if (!donor) throw new NotFoundError('Donor');
    const eligible = isDonorEligible(donor.lastDonationDate);
    if (eligible && !donor.isEligible) { await this.repo.update(id, { isEligible: true } as Record<string, unknown>); }
    return { isEligible: eligible, lastDonation: donor.lastDonationDate, nextEligibleDate: donor.nextEligibleDate, totalDonations: donor.totalDonations };
  }

  async findEligibleDonors(bloodType: string, coordinates?: [number, number], maxDistanceKm?: number) {
    return this.repo.findEligibleByBloodType(bloodType, coordinates, maxDistanceKm);
  }

  async getDonorStats() { return this.repo.countByBloodType(); }
}
