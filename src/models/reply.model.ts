import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  message: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: 'Ticket' }
}, { timestamps: true });

export const Reply = mongoose.model('Reply', replySchema);
