import { Button, Layout, Space, Modal } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { routes } from "../../constants/routes";
import { useState } from "react";
import CreatePosts from "../CreatePost";
import { queryCache } from "../../hooks/queryCache";

const { Header: AntHeader } = Layout;

function Header() {
    const { user, logout, isLogged, permissions } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate(routes.LOGIN);
    };

    const handleCreatePostSuccess = () => {
        setIsModalOpen(false);
        queryCache.invalidate("/posts");
        // Dispatch custom event to notify other components (like Home) to refetch
        window.dispatchEvent(new CustomEvent('posts-updated'));
    };

    if (!isLogged) return null;

    return (
        <AntHeader style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff', padding: '0 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', marginBottom: '20px' }}>
            <div style={{ fontSize: '20px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => navigate(routes.HOME)}>
                Role Manager
            </div>

            <Space>
                {permissions['post.create'] && (
                    <Button
                        type="default"
                        onClick={() => setIsModalOpen(true)}
                    >
                        Create Post
                    </Button>
                )}

                {user?.role === 'OWNER' && location.pathname !== routes.ADMIN_DASHBOARD && (
                    <Button
                        type="primary"
                        onClick={() => navigate(routes.ADMIN_DASHBOARD)}
                    >
                        Admin Dashboard
                    </Button>
                )}

                {location.pathname === routes.ADMIN_DASHBOARD && (
                    <Button
                        onClick={() => navigate(routes.HOME)}
                    >
                        Back to Home
                    </Button>
                )}

                <div style={{ marginRight: '10px' }}>
                    <strong>{user?.username}</strong> ({user?.role})
                </div>

                <Button danger onClick={handleLogout}>
                    Logout
                </Button>
            </Space>

            <Modal
                title="Create New Post"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                destroyOnClose
            >
                <CreatePosts onSuccess={handleCreatePostSuccess} />
            </Modal>
        </AntHeader>
    );
}

export default Header;
