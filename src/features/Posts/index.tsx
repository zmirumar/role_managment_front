import { useCustomQuery } from "../../hooks/useCustomQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { Button, Space, Modal, message, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreatePosts from "../CreatePost";
import { PostsContainer, PostCard, PostContent } from "./styles";

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
    <PostsContainer>
      <h1>Latest Posts</h1>
      {data?.map((post: Post) => (
        <PostCard key={post.id}>
          <PostContent>
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </PostContent>

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
        </PostCard>
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
    </PostsContainer>
  )
}

export default Posts
