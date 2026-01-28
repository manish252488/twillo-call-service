import Joi from 'joi';
import { WorkflowType, CallStatus } from '../models';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const createCallSchema = Joi.object({
  customerName: Joi.string().required(),
  phoneNumber: Joi.string().required(),
  workflow: Joi.string().valid(...Object.values(WorkflowType)).required(),
});

export const updateCallStatusSchema = Joi.object({
  status: Joi.string().valid(...Object.values(CallStatus)).required(),
});

