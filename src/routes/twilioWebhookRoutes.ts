import { Router, Request, Response } from 'express';
import { Call, CallStatus } from '../models';

const router: Router = Router();
// for webhook
router.post('/status', async (req: Request, res: Response) => {
  try {
    const { CallSid, CallStatus: twilioStatus } = req.body;

    if (!CallSid) {
      return res.status(400).json({ error: 'Missing CallSid' });
    }

    const call = await Call.findOne({ where: { twilioCallSid: CallSid } });
    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    let status: CallStatus;
    if (twilioStatus === 'completed') {
      status = CallStatus.COMPLETED;
    } else if (twilioStatus === 'failed' || twilioStatus === 'busy' || twilioStatus === 'no-answer') {
      status = CallStatus.FAILED;
    } else {
      status = CallStatus.PENDING;
    }

    call.status = status;
    await call.save();

    res.status(200).type('text/xml').send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  } catch (error: any) {
    res.status(500).type('text/xml').send('<?xml version="1.0" encoding="UTF-8"?><Response></Response>');
  }
});
// https://www.twilio.com/docs/voice/twiml
router.get('/twiml', async (req: Request, res: Response) => {
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">
    Hello! This is an automated call. Thank you for your time. Goodbye.
  </Say>
</Response>`;

  res.type('text/xml').send(twiml);
});

export default router;

