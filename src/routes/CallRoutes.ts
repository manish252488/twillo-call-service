import { Router } from 'express';
import { createCall, listCalls, updateCallStatus } from '../controllers/CallController';
import { authMiddleware } from '../middlewares/auth.middleware';

const router: Router = Router();

router.use(authMiddleware);

router.post('/', createCall);
router.get('/', listCalls);
router.patch('/:id/status', updateCallStatus);

export default router;

