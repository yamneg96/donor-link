import { BloodDispatch, IBloodDispatch } from '../models/BloodDispatch';
import { BloodUnit } from '../../inventory/models/BloodUnit';
import { BloodUnitStatus } from '../../../core/constants';
import { AppError } from '../../../core/errors/AppError';
import mongoose from 'mongoose';

export class BloodDispatchService {
  async createDispatch(data: Partial<IBloodDispatch>, dispatchedBy: string): Promise<IBloodDispatch> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const { bloodUnits, fromOrgId, toOrgId } = data;

      // 1. Verify all units exist and are at the source organization
      const units = await BloodUnit.find({
        _id: { $in: bloodUnits },
        currentHospitalId: fromOrgId,
        status: BloodUnitStatus.AVAILABLE,
        isDeleted: false,
      }).session(session);

      if (units.length !== (bloodUnits as any[]).length) {
        throw new AppError('One or more blood units are not available for dispatch from this organization', 400);
      }

      // 2. Create dispatch record
      const dispatch = new BloodDispatch({
        ...data,
        dispatchedBy,
        status: 'dispatched',
        dispatchedAt: new Date(),
      });

      await dispatch.save({ session });

      // 3. Update blood units status to TRANSFERRED
      await BloodUnit.updateMany(
        { _id: { $in: bloodUnits } },
        { 
          $set: { status: BloodUnitStatus.TRANSFERRED },
          $push: { 
            lifecycleHistory: {
              status: BloodUnitStatus.TRANSFERRED,
              timestamp: new Date(),
              performedBy: new mongoose.Types.ObjectId(dispatchedBy),
              notes: `Dispatched from ${fromOrgId} to ${toOrgId}`,
              organizationId: new mongoose.Types.ObjectId(fromOrgId?.toString()),
            }
          }
        },
        { session }
      );

      await session.commitTransaction();
      return dispatch;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async markAsReceived(id: string, receivedBy: string, receiptNotes: string, damagedUnits: any[] = []): Promise<IBloodDispatch> {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const dispatch = await BloodDispatch.findById(id).session(session);
      if (!dispatch || dispatch.isDeleted) {
        throw new AppError('Dispatch record not found', 404);
      }

      if (dispatch.status !== 'dispatched' && dispatch.status !== 'in_transit') {
        throw new AppError('Only dispatched or in-transit dispatches can be received', 400);
      }

      // Set final status
      const hasDamage = damagedUnits.length > 0;
      dispatch.status = hasDamage ? 'partially_received' : 'received';
      dispatch.receivedBy = new mongoose.Types.ObjectId(receivedBy);
      dispatch.receivedAt = new Date();
      dispatch.receiptNotes = receiptNotes;
      dispatch.damagedUnits = damagedUnits;

      await dispatch.save({ session });

      // Update blood units
      const healthyUnits = dispatch.bloodUnits.filter(
        id => !damagedUnits.find(d => d.bloodUnitId.toString() === id.toString())
      );

      // 1. Update healthy units
      await BloodUnit.updateMany(
        { _id: { $in: healthyUnits } },
        { 
          $set: { 
            status: BloodUnitStatus.RECEIVED,
            currentHospitalId: dispatch.toOrgId
          },
          $push: { 
            lifecycleHistory: {
              status: BloodUnitStatus.RECEIVED,
              timestamp: new Date(),
              performedBy: new mongoose.Types.ObjectId(receivedBy),
              notes: `Received at ${dispatch.toOrgId}`,
              organizationId: new mongoose.Types.ObjectId(dispatch.toOrgId.toString()),
            }
          }
        },
        { session }
      );

      // 2. Update damaged units
      if (hasDamage) {
        for (const damaged of damagedUnits) {
          await BloodUnit.findByIdAndUpdate(
            damaged.bloodUnitId,
            { 
              $set: { status: BloodUnitStatus.DISCARDED, discardReason: damaged.reason },
              $push: { 
                lifecycleHistory: {
                  status: BloodUnitStatus.DISCARDED,
                  timestamp: new Date(),
                  performedBy: new mongoose.Types.ObjectId(receivedBy),
                  notes: `Damaged during transit: ${damaged.notes}`,
                  organizationId: new mongoose.Types.ObjectId(dispatch.toOrgId.toString()),
                }
              }
            },
            { session }
          );
        }
      }

      await session.commitTransaction();
      return dispatch;
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getDispatchById(id: string): Promise<IBloodDispatch> {
    const dispatch = await BloodDispatch.findById(id)
      .populate('fromOrgId', 'name code')
      .populate('toOrgId', 'name code')
      .populate('bloodUnits', 'barcode bloodType expiryDate')
      .populate('dispatchedBy', 'firstName lastName')
      .populate('receivedBy', 'firstName lastName');
    
    if (!dispatch) {
      throw new AppError('Dispatch record not found', 404);
    }
    return dispatch;
  }

  async getDispatches(filters: any, pagination: { page: number; limit: number }): Promise<{ dispatches: IBloodDispatch[]; total: number }> {
    const query = { ...filters, isDeleted: false };
    const [dispatches, total] = await Promise.all([
      BloodDispatch.find(query)
        .sort({ createdAt: -1 })
        .skip((pagination.page - 1) * pagination.limit)
        .limit(pagination.limit)
        .populate('fromOrgId', 'name')
        .populate('toOrgId', 'name')
        .populate('dispatchedBy', 'firstName lastName'),
      BloodDispatch.countDocuments(query),
    ]);
    return { dispatches, total };
  }
}
