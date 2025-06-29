import { useEffect, useState } from 'react';
import api from '../api/axios';
import AppointmentTable from '../components/AppointmentTable';

export default function MyAppointments() {
  const [data, setData] = useState([]);

  const load = async () => {
    const { data } = await api.get('/appointments');
    setData(data);
  };

  useEffect(() => {
    load();
  }, []);

  return <AppointmentTable data={data} />;
}
