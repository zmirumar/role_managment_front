import { Button, Form, Input } from 'antd'

function CreatePosts() {
  const [form] = Form.useForm();
  
  return (
    <div>
      <Form form={form}>
        <Form.Item label="Title" name="title">
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Content" name="content">
          <Input.TextArea />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit'>Create Post</Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreatePosts