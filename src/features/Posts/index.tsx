import { useCustomQuery } from "../../hooks/CustomQuery/useCustomQuery";
import { useAuthStore } from "../../store/useAuthStore";
import { Button, Space, Modal, message, Popconfirm, Tooltip } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import CreatePosts from "../CreatePost";
import { PostsStyled } from "./styles";
import type { Post } from "../../interfaces/interfaces";

function Posts() {
  const { permissions } = useAuthStore();
  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const { data, isLoading, error, refetch } = useCustomQuery<Post[]>({
    method: "GET",
    url: "/posts",
  });

  const { mutate: deletePost, isLoading: isDeleting } = useCustomQuery<any, { id: number }>({
    method: "DELETE",
    url: "/posts/{id}",
    onSuccess: () => {
      message.success("Post deleted successfully");
      refetch();
    },
    onError: (err: Error) => {
      message.error("Failed to delete post: " + err.message);
    }
  });

  const handleEditSuccess = () => {
    setEditingPost(null);
    refetch();
  };

  if (isLoading) {
    return <div>Loading posts...</div>
  }
  if (error) {
    return <div>Error loading posts: {error.message}</div>
  }
  return (
    <PostsStyled>
      <h1>Latest Posts</h1>
      {data?.map((post: Post) => (
        <div className="post-card" key={post.id}>
          <div className="post-content">
            <h2>{post.title}</h2>
            <p>{post.content}</p>
          </div>

          <div className="post-actions">
            <Space size="middle">
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
        </div>
      ))}

      <Modal
        title="Edit Post"
        open={!!editingPost}
        onCancel={() => setEditingPost(null)}
        footer={null}
        destroyOnHidden
      >
        {editingPost && (
          <CreatePosts
            mode="edit"
            initialValues={editingPost}
            onSuccess={handleEditSuccess}
          />
        )}
      </Modal>
    </PostsStyled>
  )
}

export default Posts
