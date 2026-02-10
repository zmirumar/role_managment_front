import { useState } from 'react';
import { Menu, Button } from 'antd';
import {
    HomeOutlined,
    PlusOutlined,
    DashboardOutlined,
    LogoutOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    StarOutlined,
} from '@ant-design/icons';


import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { routes } from '../../constants/routes';
import { SidebarContainer, UserInfo, BottomSection } from './styles';

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(false);
    const { user, logout, permissions } = useAuthStore();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate(routes.LOGIN);
    };

    if (location.pathname === routes.LOGIN || location.pathname === routes.REGISTER) {
        return null;
    }

    const items = [
        {
            key: routes.HOME,
            icon: <HomeOutlined />,
            label: 'Home',
        },
        ...(permissions['post.create'] ? [{
            key: routes.CREATE_POST,
            icon: <PlusOutlined />,
            label: 'Create Post',
        }] : []),
        ...(permissions['page.counters'] ? [{
            key: routes.COUNTERS,
            icon: <DashboardOutlined />,
            label: 'Counters',
        }] : []),
        ...(user?.role === 'ADMIN' || permissions['page.fruits'] ? [{
            key: routes.FRUITS,
            icon: <StarOutlined />,
            label: 'Fruits',
        }] : []),

        ...(user?.role === 'ADMIN' ? [{




            key: 'admin',
            icon: <DashboardOutlined />,
            label: 'Admin',
            children: [
                {
                    key: routes.ADMIN_USERS,
                    label: 'Users',
                },
                {
                    key: routes.ADMIN_PERMISSIONS,
                    label: 'Permissions',
                }
            ]
        }] : []),
    ];

    return (
        <SidebarContainer trigger={null} collapsible collapsed={collapsed} theme="dark">
            <div className="logo">
                {collapsed ? 'RM' : 'Role Manager'}
            </div>

            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[location.pathname]}
                items={items}
                onClick={({ key }) => navigate(key)}
            />

            <BottomSection>
                {!collapsed && user && (
                    <UserInfo>
                        <span className="username">{user.username}</span>
                        <span className="role">{user.role}</span>
                    </UserInfo>
                )}

                <Menu
                    theme="dark"
                    mode="inline"
                    selectable={false}
                    items={[{
                        key: 'logout',
                        icon: <LogoutOutlined />,
                        label: 'Logout',
                        onClick: handleLogout,
                        danger: true,
                    }]}
                />

                <div style={{ padding: '8px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ color: 'white', width: '100%' }}
                    />
                </div>
            </BottomSection>
        </SidebarContainer>
    );
};

export default Sidebar;
