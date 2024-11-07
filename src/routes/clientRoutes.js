import express from 'express';
import { confirmPayment, removeClient, getAllClients, getBalance, initiatePayment, rechargeWallet, registerClient } from '../controllers/clientController.js'

const router = express.Router();

// POST 
router.post('/register', registerClient);
router.post('/recharge', rechargeWallet);
router.post('/initiate-payment', initiatePayment);
router.post('/confirm-payment', confirmPayment);

//GET
router.get('/balance', getBalance);
router.get('/clients', getAllClients);

//DELETE
router.delete('/remove', removeClient)

export default router;
