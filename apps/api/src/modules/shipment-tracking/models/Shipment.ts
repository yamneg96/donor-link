import mongoose, { Schema, Document } from 'mongoose';

export enum ShipmentStatus {
  CREATED = 'created',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  AT_CHECKPOINT = 'at_checkpoint',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
}

export enum ColdChainStatus {
  COMPLIANT = 'compliant',
  WARNING = 'warning',
  BREACH = 'breach',
}

export interface IStatusUpdate {
  status: ShipmentStatus;
  timestamp: Date;
  location?: string;
  coordinates?: { latitude: number; longitude: number };
  notes: string;
  updatedBy: mongoose.Types.ObjectId;
}

export interface IColdChainReading {
  temperatureCelsius: number;
  humidity: number | null;
  timestamp: Date;
  status: ColdChainStatus;
  location: string;
}

export interface IShipment extends Document {
  transferId: mongoose.Types.ObjectId;
  sourceHospitalId: mongoose.Types.ObjectId;
  destinationHospitalId: mongoose.Types.ObjectId;
  organizationId: mongoose.Types.ObjectId;
  status: ShipmentStatus;
  carrier: string;
  vehicleId: string;
  driverName: string;
  driverPhone: string;
  estimatedDepartureTime: Date;
  estimatedArrivalTime: Date;
  actualDepartureTime: Date | null;
  actualArrivalTime: Date | null;
  bloodUnitCount: number;
  statusHistory: IStatusUpdate[];
  coldChainReadings: IColdChainReading[];
  coldChainStatus: ColdChainStatus;
  routePolyline: string;
  distanceKm: number | null;
  notes: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const statusUpdateSchema = new Schema<IStatusUpdate>(
  {
    status: { type: String, enum: Object.values(ShipmentStatus), required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    location: { type: String },
    coordinates: {
      latitude: { type: Number },
      longitude: { type: Number },
    },
    notes: { type: String, default: '' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { _id: false }
);

const coldChainReadingSchema = new Schema<IColdChainReading>(
  {
    temperatureCelsius: { type: Number, required: true },
    humidity: { type: Number, default: null },
    timestamp: { type: Date, required: true, default: Date.now },
    status: { type: String, enum: Object.values(ColdChainStatus), default: ColdChainStatus.COMPLIANT },
    location: { type: String, default: '' },
  },
  { _id: false }
);

const shipmentSchema = new Schema<IShipment>(
  {
    transferId: { type: Schema.Types.ObjectId, ref: 'TransferRequest', required: true },
    sourceHospitalId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    destinationHospitalId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    status: { type: String, enum: Object.values(ShipmentStatus), default: ShipmentStatus.CREATED },
    carrier: { type: String, default: '' },
    vehicleId: { type: String, default: '' },
    driverName: { type: String, default: '' },
    driverPhone: { type: String, default: '' },
    estimatedDepartureTime: { type: Date, required: true },
    estimatedArrivalTime: { type: Date, required: true },
    actualDepartureTime: { type: Date, default: null },
    actualArrivalTime: { type: Date, default: null },
    bloodUnitCount: { type: Number, default: 0 },
    statusHistory: [statusUpdateSchema],
    coldChainReadings: [coldChainReadingSchema],
    coldChainStatus: { type: String, enum: Object.values(ColdChainStatus), default: ColdChainStatus.COMPLIANT },
    routePolyline: { type: String, default: '' },
    distanceKm: { type: Number, default: null },
    notes: { type: String, default: '' },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

shipmentSchema.index({ transferId: 1 });
shipmentSchema.index({ status: 1 });
shipmentSchema.index({ sourceHospitalId: 1 });
shipmentSchema.index({ destinationHospitalId: 1 });
shipmentSchema.index({ organizationId: 1 });
shipmentSchema.index({ coldChainStatus: 1 });

export const Shipment = mongoose.model<IShipment>('Shipment', shipmentSchema);
