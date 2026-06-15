import { Transfusion, ITransfusion } from '../models/Transfusion';
import { BloodUnit } from '../../inventory/models/BloodUnit';
import { BloodUnitStatus } from '../../../core/constants';
import { AppError } from '../../../core/errors/AppError';
import mongoose from 'mongoose';

export class TransfusionService {
  async recordTransfusion(data: Partial<ITransfusion>, performedBy: string): Promise<ITransfusion> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { bloodUnitId, hospitalOrgId } = data;

      // 1. Verify blood unit exists and is available at this hospital
      const unit = await BloodUnit.findOne({
        _id: bloodUnitId,
        currentHospitalId: hospitalOrgId,
        status: BloodUnitStatus.AVAILABLE,
        isDeleted: false,
      }).session(session);

      if (!unit) {
        throw new AppError('Blood unit not found or not available for transfusion at this hospital', 400);
      }

      // 2. Create transfusion record
      const transfusion = new Transfusion({
        ...data,
        administeredBy: performedBy,
        status: 'completed',
        outcome: 'success',
      });

      await transfusion.save({ session });

      // 3. Update blood unit status
      unit.status = BloodUnitStatus.USED;
      unit.usedAt = new Date();
      unit.lifecycleHistory.push({
        status: BloodUnitStatus.USED,
        timestamp: new Date(),
        performedBy: new mongoose.Types.ObjectId(performedBy),
        notes: `Transfused to patient ${data.patientInfo?.name}`,
        organizationId: new mongoose.Types.ObjectId(hospitalOrgId?.toString()),
      });

      await unit.save({ session });

      await session.commitTransaction();
      return transfusion;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getTransfusionById(id: string): Promise<ITransfusion> {
    const transfusion = await Transfusion.findById(id)
      .populate('bloodUnitId')
      .populate('administeredBy', 'firstName lastName')
      .populate('hospitalOrgId', 'name');
    
    if (!transfusion || transfusion.isDeleted) {
      throw new AppError('Transfusion record not found', 404);
    }
    return transfusion;
  }

  async getHospitalTransfusions(hospitalOrgId: string, pagination: { page: number; limit: number }): Promise<{ transfusions: ITransfusion[]; total: number }> {
    const [transfusions, total] = await Promise.all([
      Transfusion.find({ hospitalOrgId, isDeleted: false })
        .sort({ administeredAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .populate('administeredBy', 'firstName lastName')
        .populate('bloodUnitId', 'barcode bloodType'),
      Transfusion.countDocuments({ hospitalOrgId, isDeleted: false }),
    ]);
    return { transfusions, total };
  }

  async getAllTransfusions(filters: any, pagination: { page: number; limit: number }): Promise<{ transfusions: ITransfusion[]; total: number }> {
    const query = { ...filters, isDeleted: false };
    const [transfusions, total] = await Promise.all([
      Transfusion.find(query)
        .sort({ administeredAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .populate('administeredBy', 'firstName lastName')
        .populate('hospitalOrgId', 'name')
        .populate('bloodUnitId', 'barcode bloodType'),
      Transfusion.countDocuments(query),
    ]);
    return { transfusions, total };
  }

  async updateTransfusion(id: string, updates: Partial<ITransfusion>, editedBy: string, reason: string): Promise<ITransfusion> {
    const transfusion = await Transfusion.findById(id);
    if (!transfusion || transfusion.isDeleted) {
      throw new AppError('Transfusion record not found', 404);
    }

    if (transfusion.editCount >= 3) {
      throw new AppError('Maximum edit limit (3) reached for this transfusion record', 400);
    }

    // Save history
    transfusion.editHistory.push({
      editedBy: new mongoose.Types.ObjectId(editedBy),
      editedAt: new Date(),
      previousData: transfusion.toObject(),
      reason,
    });

    transfusion.editCount += 1;
    
    // Apply updates (limited to patient info and notes for accountability)
    if (updates.patientInfo) {
      transfusion.patientInfo = { ...transfusion.patientInfo, ...updates.patientInfo };
    }
    if (updates.notes) transfusion.notes = updates.notes;
    if (updates.outcome) transfusion.outcome = updates.outcome;
    if (updates.reactions) transfusion.reactions = updates.reactions;

    return await transfusion.save();
  }
}
