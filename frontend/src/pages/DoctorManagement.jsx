import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, message } from 'antd';
import api from '../api/axios';

export default function DoctorManagement() {
  const [list, setList] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const { data } = await api.get('/doctors');
    setList(data);
  };
  useEffect(() => {
    load();
  }, []);

  const save = async vals => {
    try {
      editing
        ? await api.put(`/doctors/${editing._id}`, vals)
        : await api.post('/doctors', vals);
      message.success('Saved');
      setOpen(false);
      form.resetFields();
      setEditing(null);
      load();
    } catch {
      message.error('Error');
    }
  };

  const del = async id => {
    await api.delete(`/doctors/${id}`);
    load();
  };

  const cols = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Specialty', dataIndex: 'specialty' },
    { title: 'Location', dataIndex: 'location' },
    {
      title: 'Action',
      render: (_, r) => (
        <>
          <a
            onClick={() => {
              setEditing(r);
              form.setFieldsValue(r);
              setOpen(true);
            }}
          >
            Edit&nbsp;
          </a>
          |&nbsp;
          <a onClick={() => del(r._id)}>Delete</a>
        </>
      )
    }
  ];

  return (
    <>
      <Button type="primary" onClick={() => setOpen(true)} style={{ marginBottom: 16 }}>
        New Doctor
      </Button>
      <Table rowKey="_id" dataSource={list} columns={cols} />
      <Modal
        open={open}
        title={editing ? 'Edit Doctor' : 'New Doctor'}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
          setEditing(null);
        }}
        onOk={() => form.submit()}
      >
        <Form layout="vertical" form={form} onFinish={save}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="specialty" label="Specialty" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="location" label="Location">
            <Input />
          </Form.Item>
          <Form.Item name="contact" label="Contact">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
