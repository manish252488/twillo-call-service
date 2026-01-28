import { Request, Response } from 'express';
import { Call, CallStatus, WorkflowType } from '../models';
import { sendCallToProvider } from '../services/telephonyService';
import { cacheService } from '../services/cacheService';

export const createCall = async (req: Request, res: Response) => {
  try {
    const { customerName, phoneNumber, workflow } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const call = await Call.create({
      customerName,
      phoneNumber,
      workflow,
      status: CallStatus.PENDING,
      userId,
    } as any);
    // remove the list from cache
    cacheService.remove(`calls_${userId}`);
    sendCallToProvider(call.id, phoneNumber, workflow).catch(() => {});
    res.status(201).json(call);
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to create call', message: error.message });
  }
};

export const listCalls = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }
    if (cacheService.get(`calls_${userId}`)) {
      return res.json(cacheService.get(`calls_${userId}`));
    }
    const calls = await Call.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
    });
    cacheService.set(`calls_${userId}`, calls, 60 * 1000); // 1 minute
    res.json(calls);
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to list calls', message: error.message });
  }
};

export const updateCallStatus = async (req: Request, res: Response) => {
  try {
    const id = typeof req.params.id === 'string' ? parseInt(req.params.id) : parseInt(req.params.id[0]);
    const { status } = req.body;
    const userId = (req as any).user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Unauthorized' });
    }

    const call = await Call.findOne({ where: { id, userId } });
    if (!call) {
      return res.status(404).json({ success: false, error: 'Call not found' });
    }

    call.status = status;
    await call.save();

    res.json(call);
  } catch (error: any) {
    res.status(500).json({ success: false, error: 'Failed to update call status', message: error.message });
  }
};

