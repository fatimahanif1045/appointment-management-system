import { useEffect, useState } from 'react';
import { message } from 'antd';
import api from '../api/axios';
import AppointmentTable from '../components/AppointmentTable';

export default function ManageAppointments() {
  const [rows, setRows] = useState([]);

  const load = async () => {
    const { data } = await api.get('/appointments'); // admin gets all
    setRows(data);
  };

  useEffect(() => {
    load();
  }, []);

  const changeStatus = async (id, status) => {
    try {
      await api.patch(`/appointments/${id}/status`, { status });
      message.success('Status updated');
      load();
    } catch {
      message.error('Could not update');
    }
  };

  return <AppointmentTable data={rows} onStatus={changeStatus} />;
}
