import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();

  const onFinish = async vals => {
    try {
      await signup(vals);
      message.success('Registered! Please login.');
      nav('/login');
    } catch (e) {
      message.error(e.response?.data?.message || 'Error');
    }
  };

  return (
    <Card title="Sign Up" style={{ maxWidth: 400, margin: 'auto', marginTop: 80 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="name" label="Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Register
        </Button>
        <div style={{ marginTop: 16 }}>
          Have an account? <Link to="/login">Login</Link>
        </div>
      </Form>
    </Card>
  );
}
