import { z } from 'zod';
import { BloodType } from '../../../core/constants';
import { AppointmentType } from '../models/Appointment';

export const scheduleAppointmentSchema = z.object({
  hospitalId: z.string().min(1, 'Hospital ID is required'),
  organizationId: z.string().optional(),
  scheduledDate: z.string().min(1, 'Scheduled date is required'),
  scheduledTime: z.string().min(1, 'Scheduled time is required'),
  endTime: z.string().min(1, 'End time is required'),
  bloodType: z.nativeEnum(BloodType).optional(),
  appointmentType: z.nativeEnum(AppointmentType).optional(),
  notes: z.string().optional(),
  donorId: z.string().optional(),
  bloodDriveId: z.string().optional(),
});

export const rescheduleAppointmentSchema = z.object({
  scheduledDate: z.string().min(1, 'New date is required'),
  scheduledTime: z.string().min(1, 'New time is required'),
  endTime: z.string().min(1, 'New end time is required'),
  hospitalId: z.string().optional(),
  donorId: z.string().optional(),
});

export const cancelAppointmentSchema = z.object({
  reason: z.string().min(1, 'Cancellation reason is required'),
});

export type ScheduleAppointmentInput = z.infer<typeof scheduleAppointmentSchema>;
export type RescheduleAppointmentInput = z.infer<typeof rescheduleAppointmentSchema>;
export type CancelAppointmentInput = z.infer<typeof cancelAppointmentSchema>;
