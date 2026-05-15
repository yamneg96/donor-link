import mongoose, { Schema, Document } from 'mongoose';

export interface IAuditLog extends Document {
  action: string; entityType: string; entityId: mongoose.Types.ObjectId;
  performedBy: mongoose.Types.ObjectId; organizationId: mongoose.Types.ObjectId | null;
  changes: { field: string; oldValue: unknown; newValue: unknown }[];
  ipAddress: string; userAgent: string; metadata: Record<string, unknown>;
  timestamp: Date; createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    action: { type: String, required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    performedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', default: null },
    changes: [{ field: String, oldValue: Schema.Types.Mixed, newValue: Schema.Types.Mixed }],
    ipAddress: { type: String, default: '' }, userAgent: { type: String, default: '' },
    metadata: { type: Schema.Types.Mixed, default: {} },
    timestamp: { type: Date, default: Date.now, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } } // Immutable
);
auditLogSchema.index({ entityType: 1, entityId: 1 }); auditLogSchema.index({ performedBy: 1 });
auditLogSchema.index({ organizationId: 1 }); auditLogSchema.index({ timestamp: -1 }); auditLogSchema.index({ action: 1 });
export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);
