import mongoose, { Schema, Document } from 'mongoose';
import { InventoryAction } from '../../../core/constants';

/**
 * Immutable inventory ledger for healthcare-grade auditability.
 * Every inventory state change is recorded as an append-only event.
 */
export interface IInventoryLedger extends Document {
  bloodUnitId: mongoose.Types.ObjectId;
  action: InventoryAction;
  organizationId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId;
  metadata: Record<string, unknown>;
  previousStatus: string | null;
  newStatus: string | null;
  notes: string;
  timestamp: Date;
  createdAt: Date;
}

const inventoryLedgerSchema = new Schema<IInventoryLedger>(
  {
    bloodUnitId: { type: Schema.Types.ObjectId, ref: 'BloodUnit', required: true },
    action: { type: String, enum: Object.values(InventoryAction), required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    previousStatus: { type: String, default: null },
    newStatus: { type: String, default: null },
    notes: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now, required: true },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Immutable — no updates
  }
);

inventoryLedgerSchema.index({ bloodUnitId: 1, timestamp: -1 });
inventoryLedgerSchema.index({ organizationId: 1, action: 1 });
inventoryLedgerSchema.index({ action: 1, timestamp: -1 });
inventoryLedgerSchema.index({ timestamp: -1 });

export const InventoryLedger = mongoose.model<IInventoryLedger>('InventoryLedger', inventoryLedgerSchema);
