import Appointment from '../models/Appointment.js';

export const createAppointment = async (req, res) => {
  const data = { ...req.body, userId: req.user.id };
  res.status(201).json(await Appointment.create(data));
};

export const listAppointments = async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { userId: req.user.id };
  res.json(
    await Appointment.find(filter)
      .populate('doctorId', 'name specialty')
      .populate('userId', 'name email')
  );
};

export const changeStatus = async (req, res) => {
  const { status } = req.body;
  res.json(
    await Appointment.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
  );
};
