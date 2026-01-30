import { Button, Form, Input } from 'antd'
import { useCustomQuery } from '../../../hooks/useCustomQuery';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../../store/useAuthStore';
import { AuthContainer, AuthCard } from "../styles";

function Register() {
  const [form] = Form.useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { mutate, error, isLoading } = useCustomQuery({
    method: "POST",
    url: "/register",
    onSuccess: (data: any) => {
      if (data?.access_token) {
        login(data.access_token, data.user, data.permissions || {});
        navigate("/");
      } else {
        navigate("/login");
      }
    },
  });

  const onFinish = (values: any) => {
    mutate(values);
  };

  if (isLoading) {
    return <AuthContainer>Loading...</AuthContainer>
  }

  return (
    <AuthContainer>
      <AuthCard>
        <h1>Register</h1>
        {error && <div style={{ color: 'red', marginBottom: '10px' }}>Error: {error.message}</div>}
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]} >
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={isLoading}>
              Register
            </Button>
          </Form.Item>
        </Form>
        <h4 style={{ textAlign: 'center', marginTop: '15px' }}>
          Already have an account? <Link to="/login">Login</Link>
        </h4>
      </AuthCard>
    </AuthContainer>
  )
}

export default Register;
