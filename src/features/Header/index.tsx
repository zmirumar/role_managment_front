import { Button, Space } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import { routes } from "../../constants/routes";
import { StyledHeader, Logo, UserInfo } from "./styles";

function Header() {
    const { user, logout, isLogged, permissions } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate(routes.LOGIN);
    };

    if (!isLogged) return null;

    return (
        <StyledHeader>
            <Logo onClick={() => navigate(routes.HOME)}>
                Role Manager
            </Logo>

            <Space>
                {permissions['post.create'] && location.pathname !== routes.CREATE_POST && (
                    <Button
                        type="default"
                        onClick={() => navigate(routes.CREATE_POST)}
                    >
                        Create Post
                    </Button>
                )}

                {user?.role === 'ADMIN' && location.pathname !== routes.ADMIN_DASHBOARD && (
                    <Button
                        type="primary"
                        onClick={() => navigate(routes.ADMIN_DASHBOARD)}
                    >
                        Admin Dashboard
                    </Button>
                )}

                {(location.pathname === routes.ADMIN_DASHBOARD || location.pathname === routes.CREATE_POST) && (
                    <Button
                        onClick={() => navigate(routes.HOME)}
                    >
                        Back to Home
                    </Button>
                )}

                <UserInfo>
                    <strong>{user?.username}</strong> ({user?.role})
                </UserInfo>

                <Button danger onClick={handleLogout}>
                    Logout
                </Button>
            </Space>
        </StyledHeader>
    );
}

export default Header;
