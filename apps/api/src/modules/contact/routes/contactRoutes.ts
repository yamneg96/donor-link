import { Router, Request, Response, NextFunction } from 'express';
import { sendSuccess } from '../../../core/utils';
import { AppError } from '../../../core/errors';

const router = Router();

// In-memory store (replace with MongoDB model in production)
const contactRequests: any[] = [];

/**
 * POST /api/v1/contact
 * Accept a contact form submission
 */
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, subject, message, category } = req.body;

    if (!name || !email || !subject || !message) {
      throw new AppError('All fields are required', 400, 'VALIDATION_ERROR');
    }

    const contact = {
      _id: `contact_${Date.now()}`,
      name,
      email,
      subject,
      message,
      category: category || 'general',
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    contactRequests.push(contact);
    console.log('[Contact] New contact request:', contact);

    sendSuccess(res, contact, 'Contact request received successfully', 201);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/contact
 * List all contact requests (admin only)
 */
router.get('/', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    sendSuccess(res, contactRequests, 'Contact requests retrieved');
  } catch (error) {
    next(error);
  }
});

export const contactRoutes = router;
