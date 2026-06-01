import mongoose from 'mongoose';
import { Shipment, IShipment, ShipmentStatus, ColdChainStatus } from '../models/Shipment';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class ShipmentRepository {
  async create(data: Partial<IShipment>): Promise<IShipment> {
    return Shipment.create(data);
  }

  async findById(id: string): Promise<IShipment | null> {
    return Shipment.findOne({ _id: id, isDeleted: false })
      .populate('sourceHospitalId', 'name code address')
      .populate('destinationHospitalId', 'name code address')
      .populate('transferId');
  }

  async findByTransfer(transferId: string): Promise<IShipment | null> {
    return Shipment.findOne({ transferId, isDeleted: false })
      .populate('sourceHospitalId', 'name code address')
      .populate('destinationHospitalId', 'name code address');
  }

  async findByHospital(hospitalId: string, direction: 'source' | 'destination' | 'both', pagination: PaginationParams) {
    const query: Record<string, any> = { isDeleted: false };
    if (direction === 'source') query.sourceHospitalId = hospitalId;
    else if (direction === 'destination') query.destinationHospitalId = hospitalId;
    else query.$or = [{ sourceHospitalId: hospitalId }, { destinationHospitalId: hospitalId }];

    const [shipments, total] = await Promise.all([
      Shipment.find(query)
        .populate('sourceHospitalId', 'name code')
        .populate('destinationHospitalId', 'name code')
        .sort(buildSortObject(pagination))
        .skip(getSkip(pagination))
        .limit(pagination.limit),
      Shipment.countDocuments(query),
    ]);
    return { shipments, total };
  }

  async findActive() {
    return Shipment.find({
      status: { $in: [ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT, ShipmentStatus.AT_CHECKPOINT] },
      isDeleted: false,
    })
      .populate('sourceHospitalId', 'name code')
      .populate('destinationHospitalId', 'name code');
  }

  async updateById(id: string, data: Partial<IShipment>): Promise<IShipment | null> {
    return Shipment.findByIdAndUpdate(id, data, { new: true });
  }

  async addStatusUpdate(id: string, statusUpdate: Record<string, any>): Promise<IShipment | null> {
    return Shipment.findByIdAndUpdate(
      id,
      {
        $push: { statusHistory: statusUpdate },
        $set: { status: statusUpdate.status },
      },
      { new: true }
    );
  }

  async addColdChainReading(id: string, reading: Record<string, any>): Promise<IShipment | null> {
    const coldChainStatus = reading.temperatureCelsius < 2 || reading.temperatureCelsius > 6
      ? (reading.temperatureCelsius < 0 || reading.temperatureCelsius > 10 ? ColdChainStatus.BREACH : ColdChainStatus.WARNING)
      : ColdChainStatus.COMPLIANT;

    return Shipment.findByIdAndUpdate(
      id,
      {
        $push: { coldChainReadings: { ...reading, status: coldChainStatus } },
        $set: { coldChainStatus },
      },
      { new: true }
    );
  }

  async getColdChainBreaches() {
    return Shipment.find({
      coldChainStatus: { $in: [ColdChainStatus.WARNING, ColdChainStatus.BREACH] },
      status: { $in: [ShipmentStatus.PICKED_UP, ShipmentStatus.IN_TRANSIT, ShipmentStatus.AT_CHECKPOINT] },
      isDeleted: false,
    })
      .populate('sourceHospitalId', 'name code')
      .populate('destinationHospitalId', 'name code');
  }

  async countByStatus() {
    return Shipment.aggregate([
      { $match: { isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }
}
