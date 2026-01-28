import { Router } from 'express';
import { login } from '../controllers/AuthController';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema } from '../lib/validation';

const router = Router();

router.post('/login', validate(loginSchema), login);

export default router;

