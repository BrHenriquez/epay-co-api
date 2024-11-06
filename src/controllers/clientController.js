import Client from '../models/Client.js';
import { generateShortToken, logger, sendMail } from '../utils/helpers.js';
import { v4 as uuidv4 } from 'uuid';

// Constants for reusability
const RESPONSE_SUCCESS = (res, message, data = {}) => res.status(200).json({ success: true, message, data });
const RESPONSE_ERROR = (res, error, status = 400) => res.status(status).json({ success: false, error: error.message });

// Validation function to keep main logic clean
const validateRequest = ({ document, name, email, phone, amount }) => {
    if (!document || !phone) throw new Error('Document and phone are required');
    if (name && !email) throw new Error('Email is required for registration');
    if (amount && amount <= 0) throw new Error('Amount must be positive');
};

export const registerClient = async (req, res) => {
    const { document, name, email, phone } = req.body;
    try {
        logger('registerClient', `Registering client: ${client.name}`);
        validateRequest({ document, name, email, phone });
        const client = new Client({ document, name, email, phone });
        logger('registerClient', `Client registered - ${client.name}`);
        await client.save();
        RESPONSE_SUCCESS(res, 'Client registered successfully');
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        if (!clients) RESPONSE_ERROR(res, 'There is no clients');
        logger('getAllClients', 'Client fetched successfully');
        RESPONSE_SUCCESS(res, 'Client fetched successfully', clients);
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};

export const rechargeWallet = async (req, res) => {
    const { document, phone, amount } = req.body;
    try {
        validateRequest({ document, phone, amount });
        const client = await Client.findOne({ document, phone });
        logger('rechargeWallet', `recharging wallet to: ${client.name}`);
        if (!client) throw new Error('Client not found');

        client.balance = (client.balance || 0) + amount;
        const date = new Date();
        client.balanceHistory.push({ amount, date, balance: client.balance, type: 'income' })
        await client.save();
        RESPONSE_SUCCESS(res, 'Recharge successful', { balance: client.balance, balanceHistory: client.balanceHistory });
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};

export const initiatePayment = async (req, res) => {
    const { document, phone, amount } = req.body;
    try {
        validateRequest({ document, phone, amount });
        const client = await Client.findOne({ document, phone });
        logger('initiatePayment', `Initiating payment of: ${client?.name}`);
        if (!client || client.balance < amount) throw new Error('Insufficient funds');

        const token = generateShortToken();
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 10 * 60000);

        const emailSent = await sendMail(client, token)
        if (emailSent) {
            logger('initiatePayment', 'email sent');
            client.sessionTokens.push({ sessionId, token, expiresAt });
            await client.save();
            RESPONSE_SUCCESS(res, 'Token sent', { sessionId });
        } else {
            RESPONSE_ERROR(res, 'email not sended');
        }
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};

export const confirmPayment = async (req, res) => {
    try {
        const { token, sessionId, document } = req.body;
        const client = await Client.findOne({ document });
        if (client.sessionTokens.length > 0) {
            const lastSessionToken = client.sessionTokens.at(-1);
            if (lastSessionToken.token === token && lastSessionToken.sessionId === sessionId) {
                logger('confirmPayment', 'Payment confirmed');
                client.balance = client.balance - amount;
                client.balanceHistory.push({ amount, date: new Date(), balance: client.balance, type: 'expense' })
                await client.save();
                RESPONSE_SUCCESS(res, 'Payment was successful', { balance: client.balance, balanceHistory: client.balanceHistory });
            }
        } else {
            RESPONSE_ERROR(res, 'Client does not have a session tokens');
        }
    } catch (error) {
        console.error(error)
        RESPONSE_ERROR(res, error);
    }
}

export const getBalance = async (req, res) => {
    const { document, phone } = req.query;
    try {
        validateRequest({ document, phone });
        const client = await Client.findOne({ document, phone: Number(phone) });
        if (!client) throw new Error('Client not found');

        RESPONSE_SUCCESS(res, 'Balance inquiry successful', { balance: client.balance });
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};
