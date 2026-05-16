import { Router, Request, Response } from 'express';
import { sendSuccess, sendError, AppError } from '../../core/utils';

const router = Router();

// In-memory store (replace with MongoDB model in production)
const contactRequests: any[] = [];

/**
 * POST /api/v1/contact
 * Accept a contact form submission
 */
router.post('/', async (req: Request, res: Response) => {
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
    if (error instanceof AppError) {
      sendError(res, error);
    } else {
      sendError(res, new AppError('Failed to process contact request', 500, 'INTERNAL_ERROR'));
    }
  }
});

/**
 * GET /api/v1/contact
 * List all contact requests (admin only)
 */
router.get('/', async (_req: Request, res: Response) => {
  try {
    sendSuccess(res, contactRequests, 'Contact requests retrieved');
  } catch (error) {
    sendError(res, new AppError('Failed to retrieve contacts', 500, 'INTERNAL_ERROR'));
  }
});

export const contactRoutes = router;
