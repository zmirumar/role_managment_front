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
import { SidebarStyled } from './styles';

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
        ...(user?.role === 'ADMIN' || permissions['page.technologies'] ? [{
            key: routes.TECHNOLOGIES,
            icon: <DashboardOutlined />,
            label: 'Technologies',
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
                },
                {
                    key: routes.ADMIN_PAGES,
                    label: "Admin Pages"
                }
            ]
        }] : []),
    ];

    return (
        <SidebarStyled trigger={null} collapsible collapsed={collapsed} theme="dark">
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

            <div className="bottom-section">
                {!collapsed && user && (
                    <div className="user-info">
                        <span className="username">{user.username}</span>
                        <span className="role">{user.role}</span>
                    </div>
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

                <div className="collapse-toggle">
                    <Button
                        type="text"
                        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        onClick={() => setCollapsed(!collapsed)}
                        style={{ color: 'white', width: '100%' }}
                    />
                </div>
            </div>
        </SidebarStyled>
    );
};

export default Sidebar;
