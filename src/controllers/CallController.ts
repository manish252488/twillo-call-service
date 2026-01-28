import { Request, Response } from 'express';
import { Call, CallStatus, WorkflowType } from '../models';
import { sendCallToProvider } from '../services/telephonyService';

export const createCall = async (req: Request, res: Response) => {
  try {
    const { customerName, phoneNumber, workflow } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!customerName || !phoneNumber || !workflow) {
      return res.status(400).json({ 
        error: 'Missing required fields: customerName, phoneNumber, workflow' 
      });
    }

    if (!Object.values(WorkflowType).includes(workflow)) {
      return res.status(400).json({ 
        error: `Invalid workflow. Must be one of: ${Object.values(WorkflowType).join(', ')}` 
      });
    }

    const call = await Call.create({
      customerName,
      phoneNumber,
      workflow,
      status: CallStatus.PENDING,
      userId,
    } as any);

    sendCallToProvider(call.id, phoneNumber, workflow).catch(() => {});

    res.status(201).json(call);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to create call', message: error.message });
  }
};

export const listCalls = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const calls = await Call.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    res.json(calls);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to list calls', message: error.message });
  }
};

export const updateCallStatus = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? parseInt(req.params.id) : parseInt(req.params.id[0]);
    const { status } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (!status || !Object.values(CallStatus).includes(status)) {
      return res.status(400).json({ 
        error: `Invalid status. Must be one of: ${Object.values(CallStatus).join(', ')}` 
      });
    }

    const call = await Call.findOne({ where: { id, userId } });
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    call.status = status;
    await call.save();

    res.json(call);
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to update call status', message: error.message });
  }
};

