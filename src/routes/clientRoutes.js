import express from 'express';
import { getAllClients, getBalance, initiatePayment, rechargeWallet, registerClient } from '../controllers/clientController.js'

const router = express.Router();

router.post('/register', registerClient);
router.post('/recharge', rechargeWallet);
router.post('/initiatePayment', initiatePayment);
router.get('/balance', getBalance);
router.get('/clients', getAllClients);

export default router;
