import express from 'express';
import { getCart, addToCart, updateCartItem, removeFromCart, clearCart, addToCartWithReplace } from '../Controllers/CartController.js';
import { authMiddleware } from '../Middleware/authMiddleware.js';

const router = express.Router();
router.use(authMiddleware)
 // all cart routes require login
router.get('/', getCart);
router.post('/', addToCart);
router.put('/item/:itemId', updateCartItem);
router.delete('/item/:itemId', removeFromCart);
router.delete('/', clearCart);
router.post('/replace', addToCartWithReplace);
export default router;