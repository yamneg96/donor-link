import { HospitalRepository } from '../repositories/hospitalRepository';
import { NotFoundError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';

export class HospitalService {
  private repo = new HospitalRepository();

  async getById(id: string) { const h = await this.repo.findById(id); if (!h) throw new NotFoundError('Hospital'); return h; }
  async getAll(filters: Record<string, unknown>, pagination: PaginationParams) { return this.repo.findAll(filters, pagination); }
  async create(data: Record<string, unknown>) { return this.repo.create(data); }
  async update(id: string, data: Record<string, unknown>) {
    const h = await this.repo.findById(id); if (!h) throw new NotFoundError('Hospital');
    return this.repo.update(id, data);
  }
  async delete(id: string) { const h = await this.repo.findById(id); if (!h) throw new NotFoundError('Hospital'); await this.repo.softDelete(id); return { message: 'Hospital deleted' }; }
  async getNearby(coordinates: [number, number], maxDistanceKm: number) { return this.repo.findNearby(coordinates, maxDistanceKm); }
}
