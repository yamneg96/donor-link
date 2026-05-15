import mongoose, { Schema, Document } from 'mongoose';

export interface ITrackingUpdate {
  status: string;
  location: string;
  timestamp: Date;
  notes: string;
}

export interface ITransferShipment extends Document {
  transferRequestId: mongoose.Types.ObjectId;
  dispatchedBy: mongoose.Types.ObjectId;
  vehicleInfo: { type: string; plateNumber: string; driverName: string; driverPhone: string };
  departureTime: Date;
  estimatedArrival: Date;
  actualArrival: Date | null;
  status: 'dispatched' | 'in_transit' | 'delivered' | 'cancelled';
  trackingUpdates: ITrackingUpdate[];
  temperatureLog: { temp: number; timestamp: Date }[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const trackingUpdateSchema = new Schema<ITrackingUpdate>({ status: String, location: String, timestamp: { type: Date, default: Date.now }, notes: String }, { _id: false });

const transferShipmentSchema = new Schema<ITransferShipment>(
  {
    transferRequestId: { type: Schema.Types.ObjectId, ref: 'TransferRequest', required: true },
    dispatchedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    vehicleInfo: {
      type: { type: String, default: 'van' }, plateNumber: { type: String, default: '' },
      driverName: { type: String, default: '' }, driverPhone: { type: String, default: '' },
    },
    departureTime: { type: Date, required: true },
    estimatedArrival: { type: Date, required: true },
    actualArrival: { type: Date, default: null },
    status: { type: String, enum: ['dispatched', 'in_transit', 'delivered', 'cancelled'], default: 'dispatched' },
    trackingUpdates: [trackingUpdateSchema],
    temperatureLog: [{ temp: Number, timestamp: { type: Date, default: Date.now } }],
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

transferShipmentSchema.index({ transferRequestId: 1 });
transferShipmentSchema.index({ status: 1 });

export const TransferShipment = mongoose.model<ITransferShipment>('TransferShipment', transferShipmentSchema);
