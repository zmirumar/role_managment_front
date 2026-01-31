import { Button, Form, Input, message } from 'antd'
import { useCustomQuery } from '../../hooks/CustomQuery/useCustomQuery';
import { useEffect } from 'react';
import { FormContainer } from './styles';
import type { CreatePostsProps } from '../../interfaces/interfaces';

function CreatePosts({ onSuccess, initialValues, mode = 'create' }: CreatePostsProps) {
  const [form] = Form.useForm();

  const isEdit = mode === 'edit';

  useEffect(() => {
    if (isEdit && initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [isEdit, initialValues, form]);

  const { mutate, isLoading } = useCustomQuery<any, { title: string, content: string }>({
    method: isEdit ? "PUT" : "POST",
    url: isEdit ? `/posts/${initialValues?.id}` : "/posts",
    onSuccess: () => {
      message.success(`Post ${isEdit ? 'updated' : 'created'} successfully!`);
      if (!isEdit) form.resetFields();
      onSuccess?.();
    },
    onError: (err) => {
      message.error(`Failed to ${mode} post: ` + err.message);
    }
  });

  const onFinish = (values: any) => {
    mutate(values);
  };

  return (
    <FormContainer $isEdit={isEdit}>
      {!isEdit && <h2>Create New Post</h2>}
      <Form form={form} onFinish={onFinish} layout="vertical">
        <Form.Item label="Title" name="title" rules={[{ required: true, message: 'Please input the title!' }]}>
          <Input type="text" />
        </Form.Item>
        <Form.Item label="Content" name="content" rules={[{ required: true, message: 'Please input the content!' }]}>
          <Input.TextArea rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType='submit' loading={isLoading} block={isEdit}>
            {isEdit ? 'Update Post' : 'Create Post'}
          </Button>
        </Form.Item>
      </Form>
    </FormContainer>
  )
}

export default CreatePosts;