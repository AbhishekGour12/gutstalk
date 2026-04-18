import express from 'express';
import {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  deleteMultipleProducts,
  bulkAddProducts,          // ✅ manual bulk upload (no Excel)
  getProductBySlug,
  
} from '../Controllers/ProductController.js';
import { handleMulterError, uploadProductImages } from '../Middleware/Multer.js';


const router = express.Router();

// ============== PRODUCT CRUD ==============
router.post('/products', uploadProductImages.array('images', 20), handleMulterError, addProduct);
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.put('/products/:id', uploadProductImages.array('images', 20), handleMulterError, updateProduct);
router.delete('/products/:id', deleteProduct);
router.delete('/bulk-delete', deleteMultipleProducts);

// ============== BULK UPLOAD (manual, no Excel) ==============
router.post('/products/bulk', uploadProductImages.array('images', 100), handleMulterError, bulkAddProducts);

// ============== PUBLIC ROUTES ==============
router.get('/products/slug/:slug', getProductBySlug);



export default router;