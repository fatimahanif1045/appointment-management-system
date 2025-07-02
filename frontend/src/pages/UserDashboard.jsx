import { useEffect, useState } from 'react';
import { Card, Typography, Row, Col } from 'antd';
import api from '../api/axios';

const { Title } = Typography;

export default function UserDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const apptRes = await api.get('/appointments');
      const docRes = await api.get('/doctors');
      setAppointments(apptRes.data);
      setDoctors(docRes.data);
    };
    fetchData();
  }, []);

  const upcoming = appointments.filter(a => a.status === 'confirmed');
  const pending = appointments.filter(a => a.status === 'pending');

  return (
    <>
      <Title level={2}>Welcome to Your Dashboard</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="Total Appointments">{appointments.length}</Card>
        </Col>
        <Col span={8}>
          <Card title="Upcoming">{upcoming.length}</Card>
        </Col>
        <Col span={8}>
          <Card title="Pending">{pending.length}</Card>
        </Col>
      </Row>
      <Row gutter={16} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title="Available Doctors">{doctors.length}</Card>
        </Col>
      </Row>
    </>
  );
}
