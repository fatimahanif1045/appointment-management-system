import Doctor from '../models/Doctor.js';

export const getAllDoctors = async (req, res) => {
  const { specialty, page = 1, limit = 10 } = req.query;
  const filter = specialty ? { specialty: { $regex: specialty, $i: true } } : {};
  const docs = await Doctor.find(filter)
    .skip((page - 1) * limit)
    .limit(+limit);
  res.json(docs);
};

export const createDoctor = async (req, res) =>
  res.status(201).json(await Doctor.create(req.body));

export const updateDoctor = async (req, res) =>
  res.json(await Doctor.findByIdAndUpdate(req.params.id, req.body, { new: true }));

export const deleteDoctor = async (req, res) =>
  res.json(await Doctor.findByIdAndDelete(req.params.id));
