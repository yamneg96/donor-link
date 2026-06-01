import { Router } from 'express';
import { AppointmentController } from '../controllers/appointmentController';
import { authenticate, authorize } from '../../../core/middleware';
import { Role } from '../../../core/constants';

const router = Router();
router.use(authenticate);

// Donor-facing
router.post('/', AppointmentController.schedule);
router.get('/my', AppointmentController.getDonorAppointments);
router.get('/donor/:donorId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), AppointmentController.getDonorAppointments);

// Hospital-facing
router.get('/hospital/:hospitalId', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), AppointmentController.getHospitalAppointments);
router.get('/hospital/:hospitalId/schedule', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), AppointmentController.getSchedule);
router.get('/hospital/:hospitalId/today', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), AppointmentController.getTodaysQueue);
router.get('/hospital/:hospitalId/slots', AppointmentController.getAvailableSlots);
router.get('/hospital/:hospitalId/stats', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN), AppointmentController.getStats);

// Appointment lifecycle
router.get('/:id', AppointmentController.getById);
router.post('/:id/confirm', AppointmentController.confirm);
router.post('/:id/check-in', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), AppointmentController.checkIn);
router.post('/:id/complete', authorize(Role.SUPER_ADMIN, Role.NATIONAL_ADMIN, Role.HOSPITAL_ADMIN, Role.LAB_STAFF), AppointmentController.complete);
router.post('/:id/cancel', AppointmentController.cancel);
router.post('/:id/reschedule', AppointmentController.reschedule);

export { router as appointmentRoutes };
