import mongoose from 'mongoose';

const availabilitySchema = new mongoose.Schema({
  date: { type: Date, required: true }, // YYYY-MM-DD
  startTime: { type: String, required: true }, // "18:00"
  endTime: { type: String, required: true },   // "21:00"
  slotDuration: { type: Number, default: 45 }, // minutes
  breakBetweenSlots: { type: Number, default: 5 }, // minutes
  maxBookingsPerSlot: { type: Number, default: 2 },
  isActive: { type: Boolean, default: true },
   bookedSlots: [{ 
    startTime: String, 
    endTime: String,
    bookingId: String 
  }] // Track booked slots with references
}, { timestamps: true });



// Index for faster date queries
availabilitySchema.index({ date: 1 });

export default mongoose.model('Availability', availabilitySchema);