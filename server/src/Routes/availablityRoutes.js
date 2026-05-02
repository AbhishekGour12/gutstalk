import express from 'express';
import { 
  generateSlots, 
  getAvailableSlots, 
  getAllSlots, 
  deleteSlot,
  deleteSlotsByDateRange,
  holdSlot, 
  releaseSlot, 
  getAvailableDates 
} from '../Controllers/availablityController.js';

const router = express.Router();

router.post('/generate', generateSlots);
router.get('/slots', getAvailableSlots);
router.get('/admin/all', getAllSlots);
router.delete('/admin/slot/:id', deleteSlot);
router.delete('/admin/range', deleteSlotsByDateRange);
router.post('/hold-slot', holdSlot);
router.post('/release-slot', releaseSlot);
router.get('/available-dates', getAvailableDates);

export default router;