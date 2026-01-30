import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../../store/useAuthStore";
import { useCustomQuery } from "../../../hooks/useCustomQuery";

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
    return <div>Loading...</div>
  }
  if (error) {
    return <div>Error: {error.message}</div>
  }
  const onFinish = (values: any) => {
    mutate(values);
  };

  return (
    <div style={{ maxWidth: 300, margin: "0 auto", marginTop: 100 }}>
      <h1>Login</h1>
      <Form
        form={form}
        onFinish={onFinish}
      >
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
          <Input placeholder="Username" />
        </Form.Item>
        <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]}>
          <Input.Password placeholder="Password" />
        </Form.Item>
        <Form.Item>
          <Button type="primary"
            htmlType="submit"
            block
          >Login</Button>
        </Form.Item>
      </Form>
      <h4>Do not have account yet? <a href="/register">Register</a></h4>
    </div>
  )
}

export default Login;
