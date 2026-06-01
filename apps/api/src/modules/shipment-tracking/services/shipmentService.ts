import { ShipmentRepository } from '../repositories/shipmentRepository';
import { ShipmentStatus } from '../models/Shipment';
import { NotFoundError, AppError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';
import { eventBus, EventType } from '../../../core/events';

export class ShipmentService {
  private repo = new ShipmentRepository();

  async create(data: Record<string, any>, userId: string) {
    const shipment = await this.repo.create({
      ...data,
      status: ShipmentStatus.CREATED,
      statusHistory: [{
        status: ShipmentStatus.CREATED,
        timestamp: new Date(),
        notes: 'Shipment created',
        updatedBy: userId as any,
      }],
    });

    eventBus.emitEvent(EventType.TRANSFER_DISPATCHED, {
      shipmentId: shipment._id.toString(),
      transferId: data.transferId,
    });

    return shipment;
  }

  async getById(id: string) {
    const shipment = await this.repo.findById(id);
    if (!shipment) throw new NotFoundError('Shipment');
    return shipment;
  }

  async getByTransfer(transferId: string) {
    const shipment = await this.repo.findByTransfer(transferId);
    if (!shipment) throw new NotFoundError('Shipment');
    return shipment;
  }

  async getByHospital(hospitalId: string, direction: 'source' | 'destination' | 'both', pagination: PaginationParams) {
    return this.repo.findByHospital(hospitalId, direction, pagination);
  }

  async getActiveShipments() {
    return this.repo.findActive();
  }

  async updateStatus(id: string, status: ShipmentStatus, userId: string, data?: Record<string, any>) {
    const shipment = await this.repo.findById(id);
    if (!shipment) throw new NotFoundError('Shipment');

    const updateData: Record<string, any> = {};

    if (status === ShipmentStatus.PICKED_UP) {
      updateData.actualDepartureTime = new Date();
    } else if (status === ShipmentStatus.DELIVERED) {
      updateData.actualArrivalTime = new Date();
    }

    await this.repo.updateById(id, updateData);

    const updated = await this.repo.addStatusUpdate(id, {
      status,
      timestamp: new Date(),
      location: data?.location,
      coordinates: data?.coordinates,
      notes: data?.notes || `Status updated to ${status}`,
      updatedBy: userId as any,
    });

    if (status === ShipmentStatus.DELIVERED) {
      eventBus.emitEvent(EventType.TRANSFER_COMPLETED, {
        shipmentId: id,
        transferId: shipment.transferId?.toString(),
      });
    }

    return updated;
  }

  async recordColdChainReading(id: string, reading: Record<string, any>) {
    const shipment = await this.repo.findById(id);
    if (!shipment) throw new NotFoundError('Shipment');

    const updated = await this.repo.addColdChainReading(id, {
      temperatureCelsius: reading.temperatureCelsius,
      humidity: reading.humidity,
      timestamp: new Date(),
      location: reading.location || '',
    });

    // Alert on cold chain breach
    if (reading.temperatureCelsius < 0 || reading.temperatureCelsius > 10) {
      eventBus.emitEvent(EventType.EXPIRY_RISK_HIGH, {
        shipmentId: id,
        type: 'cold_chain_breach',
        temperature: reading.temperatureCelsius,
      });
    }

    return updated;
  }

  async getColdChainBreaches() {
    return this.repo.getColdChainBreaches();
  }

  async getStats() {
    return this.repo.countByStatus();
  }

  async recalculateETA(id: string, newETA: Date) {
    const shipment = await this.repo.findById(id);
    if (!shipment) throw new NotFoundError('Shipment');
    return this.repo.updateById(id, { estimatedArrivalTime: newETA });
  }
}
