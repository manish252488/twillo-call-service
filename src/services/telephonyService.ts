import twilio from 'twilio';
import { Call, CallStatus, WorkflowType } from '../models';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const twimlUrl = process.env.TWIML_URL as string;
const statusCallbackUrl = process.env.STATUS_CALLBACK_URL as string;

const twilioClient = twilio(accountSid, authToken);

export const sendCallToProvider = async (
  callId: number,
  phoneNumber: string,
  workflow: WorkflowType
) => {
  try {
    const call = await Call.findByPk(callId);
    if (!call) {
      throw new Error(`Call ${callId} not found`);
    }
    const twilioCall = await twilioClient.calls.create({
      to: phoneNumber,
      from: twilioPhoneNumber as string,
      url: twimlUrl,
      statusCallback: statusCallbackUrl,
      statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed', 'busy', 'failed', 'no-answer'],
      statusCallbackMethod: 'POST',
    });

    call.twilioCallSid = twilioCall.sid;
    await call.save();
    return twilioCall;
  } catch (error: any) {
    const call = await Call.findByPk(callId);
    if (call) {
      call.status = CallStatus.FAILED;
      await call.save();
    }
    throw error;
  }
};
