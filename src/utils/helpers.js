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