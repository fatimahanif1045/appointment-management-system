import { Form, Input, Button, Card, message } from 'antd';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

export default function Signup() {
  const { signup } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  /** POST /api/auth/register  */
  const onFinish = async values => {
    setLoading(true);
    try {
      await signup(values);
      message.success('Registered! Please login.');
      nav('/login');
    } catch (err) {
      console.error('Signup error:', err); // ← logging for dev console

      // Backend may return: { errors:[{ field:'email', msg:'Email taken' }] }
      const { response } = err || {};
      if (response?.data?.errors?.length) {
        form.setFields(
          response.data.errors.map(e => ({
            name: e.field || e.param,
            errors: [e.msg || e.message]
          }))
        );
      } else {
        message.error(response?.data?.message || 'Registration failed');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Sign Up"
      style={{ maxWidth: 400, margin: 'auto', marginTop: 80 }}
    >
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[
            { required: true, message: 'Name is required' },
            { min: 3, message: 'Name must be at least 3 characters' }
          ]}
        >
          <Input placeholder="John Doe" />
        </Form.Item>

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
            { min: 6, message: 'Password must be at least 6 characters' }
          ]}
        >
          <Input.Password placeholder="••••••" />
        </Form.Item>

        <Button type="primary" htmlType="submit" block loading={loading}>
          Register
        </Button>

        <div style={{ marginTop: 16 }}>
          Have an account? <Link to="/login">Login</Link>
        </div>
      </Form>
    </Card>
  );
}
