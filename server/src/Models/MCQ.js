import mongoose from 'mongoose';

const mcqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 }
});

export default mongoose.model('MCQ', mcqSchema);