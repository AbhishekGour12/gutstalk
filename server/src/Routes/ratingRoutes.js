import express from 'express';
import { 
  submitRating, 
  getProductRatings, 
  getUserRating,
  getProductReviews
} from '../Controllers/ratingController.js';
import { authMiddleware} from '../Middleware/authMiddleware.js';


const router = express.Router();

router.route('/product/:productId')
  .get(getProductRatings)
  .post(authMiddleware,  submitRating);

router.route('/user/:productId')
  .get(authMiddleware,  getUserRating);
router.route("/reviews").get(getProductReviews)


export default router;