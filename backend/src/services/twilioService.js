const twilio = require("twilio");
const logger = require("../utils/logger");

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH;
const fromNumber = process.env.TWILIO_NUMBER;

if (!accountSid || !authToken || !fromNumber) {
  console.warn("Twilio env variables are missing. SMS will not work properly.");
}

const client = twilio(accountSid, authToken);

// Reusable function: send SOS or any alert SMS
const sendSMS = async (to, message) => {
  try {
    if (!to || !message) {
      throw new Error("Recipient number and message are required for SMS");
    }

    const sms = await client.messages.create({
      body: message,
      from: fromNumber,
      to, // must be in +countrycode format, e.g. +9198xxxxxxx
    });

    logger.info(`Twilio SMS sent to ${to}, SID: ${sms.sid}`);
    return sms;
  } catch (error) {
    logger.error(`Twilio SMS error: ${error.message}`);
    throw error;
  }
};

// Simple function just for testing
const sendTestSMS = async (to) => {
  const testMessage = "This is a test SMS from SafeHer backend.";
  return sendSMS(to, testMessage);
};

module.exports = {
  sendSMS,
  sendTestSMS,
};
