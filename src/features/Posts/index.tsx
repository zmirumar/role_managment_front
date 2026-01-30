import { useCustomQuery } from "../../hooks/useCustomQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { Button, Space, Modal, message, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreatePosts from "../CreatePost";

interface Post {
  id: number;
  title: string;
  content: string;
}

interface PostsProps {
  data?: Post[];
  isLoading?: boolean;
  error?: Error | null;
}

function Posts({ data: propData, isLoading: propLoading, error: propError }: PostsProps) {
  const { permissions } = useAuthStore();
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { data: queryData, isLoading: queryLoading, error: queryError, refetch } = useCustomQuery<Post[]>({
    method: "GET",
    url: "/posts",
    enabled: !propData,
  });

  const { mutate: deletePost, isLoading: isDeleting } = useCustomQuery<any, { id: number }>({
    method: "DELETE",
    url: "/posts/{id}",
    onSuccess: () => {
      message.success("Post deleted successfully");
      if (propData) {
        window.dispatchEvent(new CustomEvent('posts-updated'));
      } else {
        refetch();
      }
    },
    onError: (err) => {
      message.error("Failed to delete post: " + err.message);
    }
  });

  const data = propData || queryData;
  const isLoading = propLoading !== undefined ? propLoading : queryLoading;
  const error = propError !== undefined ? propError : queryError;

  const handleEditSuccess = () => {
    setEditingPost(null);
    if (propData) {
      window.dispatchEvent(new CustomEvent('posts-updated'));
    } else {
      refetch();
    }
  };

  if (isLoading) {
    return <div>Loading posts...</div>
  }
  if (error) {
    return <div>Error loading posts: {error.message}</div>
  }
  return (
    <div>
      <h1 style={{ marginBottom: '20px' }}>Latest Posts</h1>
      {data?.map((post: Post) => (
        <div
          key={post.id}
          style={{
            border: "1px solid #f0f0f0",
            padding: '20px',
            marginBottom: '15px',
            borderRadius: '12px',
            backgroundColor: '#fff',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
          }}
        >
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 10px 0', fontSize: '1.4rem' }}>{post.title}</h2>
            <p style={{ color: '#555', fontSize: '1.05rem', lineHeight: '1.6' }}>{post.content}</p>
          </div>

          <Space size="middle" style={{ marginLeft: '20px' }}>
            {permissions['post.edit'] && (
              <Tooltip title="Edit Post">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => setEditingPost(post)}
                />
              </Tooltip>
            )}

            {permissions['post.delete'] && (
              <Tooltip title="Delete Post">
                <Popconfirm
                  title="Delete post"
                  description="Are you sure to delete this post?"
                  onConfirm={() => deletePost({ id: post.id })}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ loading: isDeleting }}
                >
                  <Button
                    danger
                    icon={<DeleteOutlined />}
                  />
                </Popconfirm>
              </Tooltip>
            )}
          </Space>
        </div>
      ))}

      <Modal
        title="Edit Post"
        open={!!editingPost}
        onCancel={() => setEditingPost(null)}
        footer={null}
        destroyOnClose
      >
        {editingPost && (
          <CreatePosts
            mode="edit"
            initialValues={editingPost}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </div>
  )
}

export default Posts
