import { Router } from 'express';
import { createCall, listCalls, updateCallStatus } from '../controllers/CallController';
import { authMiddleware } from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createCallSchema, updateCallStatusSchema } from '../lib/validation';

const router: Router = Router();

router.use(authMiddleware);

router.post('/', validate(createCallSchema), createCall);
router.get('/', listCalls);
router.patch('/:id/status', validate(updateCallStatusSchema), updateCallStatus);

export default router;

