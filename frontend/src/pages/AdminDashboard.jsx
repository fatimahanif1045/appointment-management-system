import { Statistic, Row, Col } from 'antd';
import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ users: 0, doctors: 0, appointments: 0 });

  useEffect(() => {
    const load = async () => {
      const [u, d, a] = await Promise.all([
        api.get('/appointments?roleCount=users'),
        api.get('/doctors'),
        api.get('/appointments')
      ]);
      setStats({ users: u.data.length, doctors: d.data.length, appointments: a.data.length });
    };
    load();
  }, []);

  return (
    <Row gutter={16}>
      <Col span={8}>
        <Statistic title="Users" value={stats.users} />
      </Col>
      <Col span={8}>
        <Statistic title="Doctors" value={stats.doctors} />
      </Col>
      <Col span={8}>
        <Statistic title="Appointments" value={stats.appointments} />
      </Col>
    </Row>
  );
}
