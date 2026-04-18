import express from 'express';
import { deleteAvailability, getAllAvailabilities, getAvailableDates, getAvailableSlots, setAvailability } from '../Controllers/availablityController.js';

const router = express.Router();

router.get('/slots', getAvailableSlots);
router.post('/admin/set', setAvailability);
router.get('/admin/all', getAllAvailabilities)
router.get('/available-dates', getAvailableDates);
router.delete('/admin/:id',  deleteAvailability);
export default router;