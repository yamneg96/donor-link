import { AppointmentRepository } from '../repositories/appointmentRepository';
import { AppointmentStatus, AppointmentType } from '../models/Appointment';
import { NotFoundError, AppError } from '../../../core/errors';
import { PaginationParams } from '../../../core/types';
import { eventBus, EventType } from '../../../core/events';
import { generateQRCode } from '../../../core/utils';

export class AppointmentService {
  private repo = new AppointmentRepository();

  async schedule(data: Record<string, any>, donorId: string) {
    const qrCode = generateQRCode();

    const appointment = await this.repo.create({
      ...data,
      donorId: donorId as any,
      qrCode,
      status: AppointmentStatus.SCHEDULED,
      appointmentType: data.appointmentType || AppointmentType.SCHEDULED,
    });

    eventBus.emitEvent(EventType.DONATION_COMPLETED, {
      type: 'appointment_scheduled',
      appointmentId: appointment._id.toString(),
      donorId,
      hospitalId: data.hospitalId,
    });

    return appointment;
  }

  async getById(id: string) {
    const appointment = await this.repo.findById(id);
    if (!appointment) throw new NotFoundError('Appointment');
    return appointment;
  }

  async getDonorAppointments(donorId: string, pagination: PaginationParams) {
    return this.repo.findByDonor(donorId, pagination);
  }

  async getHospitalAppointments(hospitalId: string, filters: Record<string, any>, pagination: PaginationParams) {
    return this.repo.findByHospital(hospitalId, filters, pagination);
  }

  async getHospitalSchedule(hospitalId: string, startDate: Date, endDate: Date) {
    return this.repo.findByDateRange(hospitalId, startDate, endDate);
  }

  async getTodaysQueue(hospitalId: string) {
    return this.repo.getTodaysAppointments(hospitalId);
  }

  async confirm(id: string) {
    const appointment = await this.repo.findById(id);
    if (!appointment) throw new NotFoundError('Appointment');
    if (appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new AppError('Appointment cannot be confirmed in current state', 400, 'INVALID_STATUS');
    }
    return this.repo.updateById(id, { status: AppointmentStatus.CONFIRMED, confirmedAt: new Date() });
  }

  async checkIn(id: string) {
    const appointment = await this.repo.findById(id);
    if (!appointment) throw new NotFoundError('Appointment');
    if (appointment.status !== AppointmentStatus.CONFIRMED && appointment.status !== AppointmentStatus.SCHEDULED) {
      throw new AppError('Appointment cannot be checked in', 400, 'INVALID_STATUS');
    }
    return this.repo.updateById(id, { status: AppointmentStatus.CHECKED_IN, checkedInAt: new Date() });
  }

  async complete(id: string) {
    const appointment = await this.repo.findById(id);
    if (!appointment) throw new NotFoundError('Appointment');
    return this.repo.updateById(id, { status: AppointmentStatus.COMPLETED, completedAt: new Date() });
  }

  async cancel(id: string, reason: string) {
    const appointment = await this.repo.findById(id);
    if (!appointment) throw new NotFoundError('Appointment');
    if (appointment.status === AppointmentStatus.COMPLETED) {
      throw new AppError('Cannot cancel a completed appointment', 400, 'ALREADY_COMPLETED');
    }
    return this.repo.updateById(id, {
      status: AppointmentStatus.CANCELLED,
      cancellationReason: reason,
    });
  }

  async reschedule(id: string, newData: Record<string, any>, donorId: string) {
    const existing = await this.repo.findById(id);
    if (!existing) throw new NotFoundError('Appointment');

    await this.repo.updateById(id, { status: AppointmentStatus.RESCHEDULED });

    return this.schedule({
      ...newData,
      hospitalId: newData.hospitalId || existing.hospitalId,
      organizationId: newData.organizationId || existing.organizationId,
      rescheduledFrom: existing._id,
    }, donorId);
  }

  async getAvailableSlots(hospitalId: string, date: Date) {
    return this.repo.findAvailableSlots(hospitalId, date);
  }

  async getStats(hospitalId: string) {
    return this.repo.countByStatusForHospital(hospitalId);
  }
}
