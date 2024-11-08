import { Recipient, EmailParams, MailerSend } from 'mailersend';
import { v4 as uuidv4 } from 'uuid';
import dotenv from 'dotenv';
dotenv.config();

export const logger = (endpointName, message) => console.log(`${new Date()} [ecopay-co] ${endpointName} - ${message}`)

export const generateShortToken = () => uuidv4().replace(/-/g, '').slice(0, 6); // Remove dashes and take the first 6 characters


export const sendMail = async (client, verificationCode) => {
    try {
        console.log('sending mail to', client.name);

        const mailersend = new MailerSend({
            apiKey: process.env.MAIL_SENDER_API_KEY,
        });

        const personalization = [
            {
                email: client.email,
                data: {
                    name: client.name,
                    verificationCode: verificationCode
                },
            }
        ];
        const recipients = [new Recipient(client.email, client.name)];

        const params = new EmailParams();

        const emailParams = params
            .setFrom({ email: process.env.MAIL_SENDER_EMAIL, name: process.env.MAIL_SENDER_NAME })
            .setTo(recipients)
            .setSubject("Verification code")
            .setTemplateId(process.env.MAIL_SENDER_TEMPLATE_ID)
            .setPersonalization(personalization);

        await mailersend.email.send(emailParams);
        return true
    } catch (error) {
        console.error('could not send token email', error);
    }
}

// Constants for reusability
export const RESPONSE_SUCCESS = (res, message, data = {}) => res.status(200).json({ success: true, message, data });
export const RESPONSE_ERROR = (res, error, status = 400) => res.status(status).json({ success: false, error: error.message });

// Validation function to keep main logic clean
export const validateRequest = ({ document, name, email, phone, amount }) => {
    if (!document || !phone) throw new Error('Document and phone are required');
    if (name && !email) throw new Error('Email is required for registration');
    if (amount && amount <= 0) throw new Error('Amount must be positive');
};