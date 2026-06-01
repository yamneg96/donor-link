import mongoose from 'mongoose';
import { Appointment, IAppointment, AppointmentStatus } from '../models/Appointment';
import { AppointmentSlot, IAppointmentSlot } from '../models/AppointmentSlot';
import { PaginationParams } from '../../../core/types';
import { buildSortObject, getSkip } from '../../../core/utils';

export class AppointmentRepository {
  // === Appointments ===
  async create(data: Partial<IAppointment>): Promise<IAppointment> {
    return Appointment.create(data);
  }

  async findById(id: string): Promise<IAppointment | null> {
    return Appointment.findOne({ _id: id, isDeleted: false })
      .populate('donorId', 'firstName lastName bloodType phone')
      .populate('hospitalId', 'name code address');
  }

  async findByDonor(donorId: string, pagination: PaginationParams) {
    const query = { donorId, isDeleted: false };
    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('hospitalId', 'name code address')
        .sort(buildSortObject(pagination))
        .skip(getSkip(pagination))
        .limit(pagination.limit),
      Appointment.countDocuments(query),
    ]);
    return { appointments, total };
  }

  async findByHospital(hospitalId: string, filters: Record<string, any>, pagination: PaginationParams) {
    const query: Record<string, any> = { hospitalId, isDeleted: false, ...filters };
    const [appointments, total] = await Promise.all([
      Appointment.find(query)
        .populate('donorId', 'firstName lastName bloodType phone')
        .sort(buildSortObject(pagination))
        .skip(getSkip(pagination))
        .limit(pagination.limit),
      Appointment.countDocuments(query),
    ]);
    return { appointments, total };
  }

  async findByDateRange(hospitalId: string, startDate: Date, endDate: Date) {
    return Appointment.find({
      hospitalId,
      scheduledDate: { $gte: startDate, $lte: endDate },
      isDeleted: false,
      status: { $nin: [AppointmentStatus.CANCELLED] },
    }).populate('donorId', 'firstName lastName bloodType');
  }

  async updateById(id: string, data: Partial<IAppointment>): Promise<IAppointment | null> {
    return Appointment.findByIdAndUpdate(id, data, { new: true });
  }

  async countByStatusForHospital(hospitalId: string) {
    return Appointment.aggregate([
      { $match: { hospitalId: new mongoose.Types.ObjectId(hospitalId), isDeleted: false } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }

  async getTodaysAppointments(hospitalId: string) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return Appointment.find({
      hospitalId,
      scheduledDate: { $gte: today, $lt: tomorrow },
      isDeleted: false,
    })
      .populate('donorId', 'firstName lastName bloodType phone')
      .sort({ scheduledTime: 1 });
  }

  // === Slots ===
  async createSlot(data: Partial<IAppointmentSlot>): Promise<IAppointmentSlot> {
    return AppointmentSlot.create(data);
  }

  async findAvailableSlots(hospitalId: string, date: Date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    return AppointmentSlot.find({
      hospitalId,
      date: { $gte: dayStart, $lt: dayEnd },
      isActive: true,
      isDeleted: false,
      $expr: { $lt: ['$booked', '$capacity'] },
    }).sort({ startTime: 1 });
  }

  async incrementSlotBooking(slotId: string): Promise<IAppointmentSlot | null> {
    return AppointmentSlot.findOneAndUpdate(
      { _id: slotId, $expr: { $lt: ['$booked', '$capacity'] } },
      { $inc: { booked: 1 } },
      { new: true }
    );
  }

  async decrementSlotBooking(slotId: string): Promise<IAppointmentSlot | null> {
    return AppointmentSlot.findOneAndUpdate(
      { _id: slotId, booked: { $gt: 0 } },
      { $inc: { booked: -1 } },
      { new: true }
    );
  }
}
