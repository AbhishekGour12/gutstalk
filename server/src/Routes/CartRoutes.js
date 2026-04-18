import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart } from '../Controllers/CartController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware)
 // all cart routes require login
router.get('/', getCart);
router.post('/', addToCart);
router.put('/:productId', updateCartItem);
router.delete('/:productId', removeFromCart);
router.delete('/', clearCart);

export default router;