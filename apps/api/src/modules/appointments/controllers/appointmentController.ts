import { Request, Response, NextFunction } from 'express';
import { AppointmentService } from '../services/appointmentService';
import { sendSuccess, sendCreated, sendPaginated, parsePagination } from '../../../core/utils';

export class AppointmentController {
  private static service = new AppointmentService();

  static schedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = req.body.donorId || req.user?.id?.toString();
      const appointment = await AppointmentController.service.schedule(req.body, donorId);
      sendCreated(res, appointment, 'Appointment scheduled successfully');
    } catch (error) {
      next(error);
    }
  };

  static getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointment = await AppointmentController.service.getById(req.params.id);
      sendSuccess(res, { appointment });
    } catch (error) {
      next(error);
    }
  };

  static getDonorAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePagination(req.query);
      const donorId = req.params.donorId || req.user?.id?.toString();
      if (!donorId) throw new Error('Donor ID is required');
      const result = await AppointmentController.service.getDonorAppointments(donorId, pagination);
      sendPaginated(res, result.appointments, { page: pagination.page, limit: pagination.limit, total: result.total });
    } catch (error) {
      next(error);
    }
  };

  static getHospitalAppointments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePagination(req.query);
      const hospitalId = req.params.hospitalId || req.user?.organizationId?.toString();
      if (!hospitalId) throw new Error('Hospital ID is required');
      const filters: Record<string, any> = {};
      if (req.query.status) filters.status = req.query.status;
      if (req.query.date) filters.scheduledDate = new Date(req.query.date as string);
      const result = await AppointmentController.service.getHospitalAppointments(hospitalId, filters, pagination);
      sendPaginated(res, result.appointments, { page: pagination.page, limit: pagination.limit, total: result.total });
    } catch (error) {
      next(error);
    }
  };

  static getSchedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hospitalId = req.params.hospitalId || req.user?.organizationId?.toString();
      if (!hospitalId) throw new Error('Hospital ID is required');
      const startDate = new Date(req.query.startDate as string);
      const endDate = new Date(req.query.endDate as string);
      const schedule = await AppointmentController.service.getHospitalSchedule(hospitalId, startDate, endDate);
      sendSuccess(res, { schedule });
    } catch (error) {
      next(error);
    }
  };

  static getTodaysQueue = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hospitalId = req.params.hospitalId || req.user?.organizationId?.toString();
      if (!hospitalId) throw new Error('Hospital ID is required');
      const queue = await AppointmentController.service.getTodaysQueue(hospitalId);
      sendSuccess(res, { queue });
    } catch (error) {
      next(error);
    }
  };

  static confirm = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointment = await AppointmentController.service.confirm(req.params.id);
      sendSuccess(res, { appointment }, 'Appointment confirmed');
    } catch (error) {
      next(error);
    }
  };

  static checkIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointment = await AppointmentController.service.checkIn(req.params.id);
      sendSuccess(res, { appointment }, 'Donor checked in');
    } catch (error) {
      next(error);
    }
  };

  static complete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const appointment = await AppointmentController.service.complete(req.params.id);
      sendSuccess(res, { appointment }, 'Appointment completed');
    } catch (error) {
      next(error);
    }
  };

  static cancel = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { reason } = req.body;
      const appointment = await AppointmentController.service.cancel(req.params.id, reason);
      sendSuccess(res, { appointment }, 'Appointment cancelled');
    } catch (error) {
      next(error);
    }
  };

  static reschedule = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const donorId = req.body.donorId || req.user?.id?.toString();
      const appointment = await AppointmentController.service.reschedule(req.params.id, req.body, donorId);
      sendCreated(res, appointment, 'Appointment rescheduled');
    } catch (error) {
      next(error);
    }
  };

  static getAvailableSlots = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hospitalId = req.params.hospitalId;
      const date = new Date(req.query.date as string);
      const slots = await AppointmentController.service.getAvailableSlots(hospitalId, date);
      sendSuccess(res, { slots });
    } catch (error) {
      next(error);
    }
  };

  static getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const hospitalId = req.params.hospitalId || req.user?.organizationId?.toString();
      if (!hospitalId) throw new Error('Hospital ID is required');
      const stats = await AppointmentController.service.getStats(hospitalId);
      sendSuccess(res, { stats });
    } catch (error) {
      next(error);
    }
  };
}
