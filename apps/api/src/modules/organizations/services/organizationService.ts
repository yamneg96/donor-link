import { OrganizationRepository } from '../repositories/organizationRepository';
import { NotFoundError, ConflictError } from '../../../core/errors';
import { generateOrgCode } from '../../../core/utils';
import { PaginationParams } from '../../../core/types';

export class OrganizationService {
  private orgRepo: OrganizationRepository;
  constructor() { this.orgRepo = new OrganizationRepository(); }

  async getById(id: string) {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundError('Organization');
    return org;
  }

  async getAll(filters: Record<string, unknown>, pagination: PaginationParams) {
    return this.orgRepo.findAll(filters, pagination);
  }

  async create(data: Record<string, unknown>) {
    if (data.code) {
      const existing = await this.orgRepo.findByCode(data.code as string);
      if (existing) throw new ConflictError('Organization code already exists');
    } else {
      data.code = generateOrgCode(data.type as string, data.region as string);
    }
    return this.orgRepo.create(data);
  }

  async update(id: string, data: Record<string, unknown>) {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundError('Organization');
    return this.orgRepo.update(id, data);
  }

  async delete(id: string) {
    const org = await this.orgRepo.findById(id);
    if (!org) throw new NotFoundError('Organization');
    await this.orgRepo.softDelete(id);
    return { message: 'Organization deleted' };
  }

  async getHierarchy(parentId: string) {
    return this.orgRepo.findChildren(parentId);
  }

  async getNearby(coordinates: [number, number], maxDistanceKm: number) {
    return this.orgRepo.findNearby(coordinates, maxDistanceKm);
  }

  async getStats() {
    return this.orgRepo.countByType();
  }
}
