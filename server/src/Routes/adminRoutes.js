import express from 'express';
import { getAllOrders } from '../Controllers/OrderController.js';
const router = express.Router();

router.get('/orders', getAllOrders )

export default router;