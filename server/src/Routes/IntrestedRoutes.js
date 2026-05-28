import express from 'express';
import { 
  getUserInterests, 
  addUserInterest, 
  removeUserInterest, 
  checkUserInterest, 
  getProductLikesCount
} from '../Controllers/intrestedController.js';
import { authMiddleware} from '../Middleware/authMiddleware.js';


const router = express.Router();

router.get('/', getUserInterests)
router.post('/', authMiddleware, addUserInterest);

router.get('/:productId', authMiddleware, checkUserInterest)
 router.delete('/:productId', authMiddleware, removeUserInterest);
  
router.get('/likeCount/:productId', getProductLikesCount);
export default router;