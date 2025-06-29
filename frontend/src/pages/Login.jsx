import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();

  const onFinish = async vals => {
    try {
      await login(vals.email, vals.password);
      nav('/');
    } catch {
      message.error('Invalid credentials');
    }
  };

  return (
    <Card title="Login" style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}>
      <Form layout="vertical" onFinish={onFinish}>
        <Form.Item name="email" label="Email" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="password" label="Password" rules={[{ required: true }]}>
          <Input.Password />
        </Form.Item>
        <Button type="primary" htmlType="submit" block>
          Login
        </Button>
        <div style={{ marginTop: 16 }}>
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </Form>
    </Card>
  );
}
