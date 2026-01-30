import { Button, Form, Input } from 'antd'
import { useCustomQuery } from '../../../hooks/useCustomQuery';
import { useNavigate } from 'react-router';
import { useAuthStore } from '../../../store/useAuthStore';

function Register() {
  const [form] = Form.useForm();
    const { login } = useAuthStore();
  const navigate = useNavigate();

  const {mutate, error, isLoading} = useCustomQuery({
    method: "POST",
    url: "/register",
        onSuccess: (data: any) => {
      if (data?.access_token) {
        login(data.access_token, data.user);
        navigate("/");
      } else {
        navigate("/login");
      }
    },
  });

    const onFinish = (values: any) => {
    mutate({
      ...values,
    });
  };



  if(isLoading){
    return <div>Loading...</div>
  }
  if(error){
    return <div>Error: {error.message}</div>
  }
  return (
    <div style={{ maxWidth: 300, margin: "0 auto", marginTop: 100 }}>
      <h1>Register</h1>
    <Form
   form={form}
    onFinish={onFinish}>
        <Form.Item name="username" rules={[{ required: true, message: 'Please input your Username!' }]}>
            <Input placeholder="Username" />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: 'Please input your Password!' }]} >
                <Input.Password placeholder="Password" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit">Register</Button>
            </Form.Item>
        </Form>
        <h4>Already have an account? <a href="/login">Login</a></h4>
    </div>
  )
}

export default Register

