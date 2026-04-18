import express from "express";
import { shippingCharge } from "../Controllers/shippingController.js";

import { authMiddleware } from "../Middleware/authMiddleware.js";
import { trackUserOrder } from "../Controllers/OrderController.js";


const router = express.Router();

router.post("/charge", shippingCharge);
router.get("/track/:shipmentId", authMiddleware, trackUserOrder );

export default router;
