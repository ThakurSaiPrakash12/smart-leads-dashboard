import { Router } from 'express';
import {
  getLeads,
  createLead,
  getLeadById,
  updateLead,
  deleteLead,
  exportLeads,
} from '../controllers/lead.controller';
import { protect } from '../middleware/authMiddleware';
import { requireRole } from '../middleware/roleMiddleware';
import { validateRequest } from '../middleware/validateRequest';
import {
  createLeadSchema,
  updateLeadSchema,
  leadQuerySchema,
  leadIdParamSchema,
} from '../validators/lead.validators';
import { UserRole } from '../constants/enums';

const router = Router();

router.use(protect);

router.get('/export', requireRole(UserRole.ADMIN), validateRequest(leadQuerySchema, 'query'), exportLeads);

router.get('/', validateRequest(leadQuerySchema, 'query'), getLeads);
router.post('/', validateRequest(createLeadSchema), createLead);
router.get('/:id', validateRequest(leadIdParamSchema, 'params'), getLeadById);
router.put(
  '/:id',
  validateRequest(leadIdParamSchema, 'params'),
  validateRequest(updateLeadSchema),
  updateLead
);
router.delete(
  '/:id',
  validateRequest(leadIdParamSchema, 'params'),
  requireRole(UserRole.ADMIN),
  deleteLead
);

export default router;
