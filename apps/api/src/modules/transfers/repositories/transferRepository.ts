import { TransferRequest, ITransferRequest } from '../models/TransferRequest';
import { TransferShipment, ITransferShipment } from '../models/TransferShipment';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class TransferRepository {
  async findById(id: string): Promise<ITransferRequest | null> {
    return TransferRequest.findOne({ _id: id, isDeleted: false }).populate('fromOrgId', 'name code').populate('toOrgId', 'name code').populate('requestedBy', 'firstName lastName').populate('approvedBy', 'firstName lastName');
  }
  async findAll(filters: Record<string, unknown>, pagination: PaginationParams) {
    const query = { isDeleted: false, ...filters };
    const [transfers, total] = await Promise.all([
      TransferRequest.find(query).populate('fromOrgId', 'name code').populate('toOrgId', 'name code').populate('requestedBy', 'firstName lastName').sort(buildSortObject(pagination)).skip(getSkip(pagination)).limit(pagination.limit),
      TransferRequest.countDocuments(query),
    ]);
    return { transfers, total };
  }
  async create(data: Partial<ITransferRequest>): Promise<ITransferRequest> { return TransferRequest.create(data); }
  async update(id: string, data: Partial<ITransferRequest>): Promise<ITransferRequest | null> { return TransferRequest.findByIdAndUpdate(id, data, { new: true }); }

  // Shipments
  async createShipment(data: Partial<ITransferShipment>): Promise<ITransferShipment> { return TransferShipment.create(data); }
  async findShipmentByTransfer(transferId: string): Promise<ITransferShipment | null> { return TransferShipment.findOne({ transferRequestId: transferId }).populate('dispatchedBy', 'firstName lastName'); }
  async updateShipment(id: string, data: Partial<ITransferShipment>): Promise<ITransferShipment | null> { return TransferShipment.findByIdAndUpdate(id, data, { new: true }); }
  async addTrackingUpdate(shipmentId: string, update: Record<string, unknown>): Promise<void> { await TransferShipment.findByIdAndUpdate(shipmentId, { $push: { trackingUpdates: update } }); }
}
