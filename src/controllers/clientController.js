import Client from '../models/Client.js';
import { generateToken } from '../utils/helpers.js';
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
        validateRequest({ document, name, email, phone });
        const client = new Client({ document, name, email, phone });
        await client.save();
        RESPONSE_SUCCESS(res, 'Client registered successfully');
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};

export const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find();
        if(!clients) RESPONSE_ERROR(res, 'There is no clients');
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
        if (!client) throw new Error('Client not found');

        client.balance = (client.balance || 0) + amount;
        await client.save();
        RESPONSE_SUCCESS(res, 'Recharge successful', { balance: client.balance });
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};

export const initiatePayment = async (req, res) => {
    const { document, phone, amount } = req.body;
    try {
        validateRequest({ document, phone, amount });
        const client = await Client.findOne({ document, phone });
        if (!client || client.balance < amount) throw new Error('Insufficient funds');

        const token = generateToken();
        const sessionId = uuidv4();
        const expiresAt = new Date(Date.now() + 10 * 60000);

        client.sessionTokens.push({ sessionId, token, expiresAt });
        await client.save();

        RESPONSE_SUCCESS(res, 'Token sent', { sessionId });
    } catch (error) {
        RESPONSE_ERROR(res, error);
    }
};

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
