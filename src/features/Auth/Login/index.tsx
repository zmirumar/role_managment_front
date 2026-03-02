import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useCustomQuery } from "../../../hooks/CustomQuery/useCustomQuery";
import { AuthStyled } from "../styles";

function Login() {
  const [form] = Form.useForm();
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const { mutate, error, isLoading } = useCustomQuery({
    method: "POST",
    url: "/login",
    onSuccess: (data: any) => {
      login(data.token, data.user, data.permissions);
      navigate("/");
    },
  });

  if (isLoading) {
    return <AuthStyled>Loading...</AuthStyled>
  }

  const onFinish = (values: any) => {
    mutate(values);
  };

  return (
    <AuthStyled>
      <div className="auth-card">
        <h1>Login</h1>
        {error && <div className="error-message">Error: {error.message}</div>}
        <Form
          form={form}
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input placeholder="Username" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
            <Input.Password placeholder="Password" size="large" />
          </Form.Item>
          <Form.Item>
            <Button type="primary"
              htmlType="submit"
              block
              size="large"
              loading={isLoading}
            >Login</Button>
          </Form.Item>
        </Form>
        <h4 className="auth-link">
          Do not have account yet? <Link to="/register">Register</Link>
        </h4>
      </div>
    </AuthStyled>
  )
}

export default Login;
