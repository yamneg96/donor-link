import { RequestRepository } from '../repositories/requestRepository';
import { NotFoundError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';
import { RequestStatus } from '../../../core/constants';

export class RequestService {
  private repo = new RequestRepository();

  async getById(id: string) { const r = await this.repo.findById(id); if (!r) throw new NotFoundError('Blood Request'); return r; }
  async getAll(filters: Record<string, unknown>, pagination: PaginationParams) { return this.repo.findAll(filters, pagination); }
  async create(data: Record<string, unknown>) {
    if (!data.expiresAt) {
      const expires = new Date(); expires.setDate(expires.getDate() + 7);
      data.expiresAt = expires;
    }
    return this.repo.create(data);
  }
  async update(id: string, data: Record<string, unknown>) { const r = await this.repo.findById(id); if (!r) throw new NotFoundError('Blood Request'); return this.repo.update(id, data); }
  async fulfillUnit(requestId: string, unitId: string) {
    const request = await this.repo.findById(requestId);
    if (!request) throw new NotFoundError('Blood Request');
    await this.repo.addFulfilledUnit(requestId, unitId);
    const newCount = request.fulfilledUnits.length + 1;
    if (newCount >= request.quantity) {
      await this.repo.update(requestId, { status: RequestStatus.FULFILLED, fulfilledAt: new Date() } as any);
    } else {
      await this.repo.update(requestId, { status: RequestStatus.PARTIALLY_FULFILLED } as any);
    }
    return this.repo.findById(requestId);
  }
  async cancel(id: string) { return this.repo.update(id, { status: RequestStatus.CANCELLED } as any); }
}
