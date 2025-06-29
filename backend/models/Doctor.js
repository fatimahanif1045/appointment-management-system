import mongoose from 'mongoose';

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    specialty: { type: String, required: true },
    availability: [{ day: String, times: [String] }],
    location: String,
    contact: String
  },
  { timestamps: true }
);

export default mongoose.model('Doctor', doctorSchema);
