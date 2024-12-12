import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const twilioClient = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);


export const sendOTP = (phoneNumber, otp) => {
    return twilioClient.messages
        .create({
            body: `Your verification code is ${otp}. It will expire in 10 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phoneNumber,
        })
        .then((message) => {
            console.log('OTP sent successfully:', message.sid);
            return message.sid; // Resolve with message SID if needed
        })
        .catch((error) => {
            console.error('Error sending OTP:', error);
            throw new Error('Failed to send OTP.'); // Propagate the error
        });
};

