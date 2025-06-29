import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Doctor', required: true },
    date: { type: String, required: true },  // ISO yyyy‑mm‑dd
    time: { type: String, required: true },  // "14:30"
    status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' }
  },
  { timestamps: true }
);

export default mongoose.model('Appointment', appointmentSchema);
