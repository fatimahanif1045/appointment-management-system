import { useEffect, useState } from 'react';
import { Input, Row, Col, message, Modal, DatePicker, TimePicker } from 'antd';
import api from '../api/axios';
import DoctorCard from '../components/DoctorCard';

export default function DoctorDirectory() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [sel, setSel] = useState(null);

  const fetchDocs = async () => {
    const { data } = await api.get('/doctors', { params: { specialty: q } });
    setList(data);
  };

  useEffect(() => {
    fetchDocs();
  }, [q]);

  const book = async () => {
    try {
      const date = sel.date.format('YYYY-MM-DD');
      const time = sel.time.format('HH:mm');
      await api.post('/appointments', { doctorId: sel.doc._id, date, time });
      message.success('Appointment requested');
      setSel(null);
    } catch {
      message.error('Error booking');
    }
  };

  return (
    <>
      <Input.Search
        placeholder="Search specialty"
        onSearch={setQ}
        allowClear
        style={{ marginBottom: 24 }}
      />
      <Row gutter={[16, 16]}>
        {list.map(d => (
          <Col xs={24} md={12} lg={8} key={d._id}>
            <DoctorCard doc={d} onBook={() => setSel({ doc: d })} />
          </Col>
        ))}
      </Row>
      <Modal
        title="Book Appointment"
        open={!!sel}
        onOk={book}
        onCancel={() => setSel(null)}
        okText="Book"
      >
        <p>{sel?.doc?.name}</p>
        <DatePicker
          style={{ width: '100%', marginBottom: 16 }}
          onChange={date => setSel(prev => ({ ...prev, date }))}
        />
        <TimePicker
          style={{ width: '100%' }}
          format="HH:mm"
          onChange={time => setSel(prev => ({ ...prev, time }))}
        />
      </Modal>
    </>
  );
}
