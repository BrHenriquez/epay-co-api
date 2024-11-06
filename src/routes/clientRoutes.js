import express from 'express';
import { confirmPayment, getAllClients, getBalance, initiatePayment, rechargeWallet, registerClient } from '../controllers/clientController.js'

const router = express.Router();

// POST 
router.post('/register', registerClient);
router.post('/recharge', rechargeWallet);
router.post('/initiatePayment', initiatePayment);
router.post('/confirmPayment', confirmPayment);

//GET
router.get('/balance', getBalance);
router.get('/clients', getAllClients);

export default router;
