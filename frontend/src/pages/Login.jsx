import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  /** POST /api/auth/login */
  const onFinish = async ({ email, password }) => {
    setLoading(true);
    try {
      await login(email, password);
      nav('/');
    } catch (err) {
      console.error('Login error:', err); // ← logging to dev console

      // Backend may return: { errors:[{ field:'email', msg:'Invalid credentials' }] }
      const { response } = err || {};
      if (response?.data?.errors?.length) {
        form.setFields(
          response.data.errors.map(e => ({
            name: e.field || e.param,
            errors: [e.msg || e.message]
          }))
        );
      } else {
        message.error(response?.data?.message || 'Invalid credentials');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Login"
      style={{ maxWidth: 400, margin: 'auto', marginTop: 100 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Email is required' },
            { type: 'email', message: 'Enter a valid email' }
          ]}
        >
          <Input placeholder="john@example.com" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: 'Password is required' },
            { min: 6, message: 'Minimum 6 characters' }
          ]}
        >
          <Input.Password placeholder="••••••" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading} block>
          Login
        </Button>

        <div style={{ marginTop: 16 }}>
          No account? <Link to="/signup">Sign up</Link>
        </div>
      </Form>
    </Card>
  );
}
