import { Table, Select, message, Drawer, Input, Button, Tag, Space, Popconfirm } from 'antd'
import { useState } from 'react';
import { useCustomQuery } from '../../../hooks/CustomQuery/useCustomQuery';
import { AdminUsersStyled } from './style';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

interface Permission {
    id: number;
    name: string;
    slug: string;
}

interface Role {
    id: number;
    name: string;
    slug: string;
    permissions: Permission[];
}

interface User {
    id: number;
    username: string;
    role: Role;
    created_at: string;
    updated_at: string;
}

export default function Users() {
    const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const [editUsername, setEditUsername] = useState<string>('');
    const [editPassword, setEditPassword] = useState<string>('');
    const [newRoleName, setNewRoleName] = useState<string>('');
    const [selectValue, setSelectValue] = useState<string>('');

    const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useCustomQuery<User[]>({
        method: "GET",
        url: "/admin/users",
    });

    const { data: roles, isLoading: rolesLoading, refetch: refetchRoles } = useCustomQuery<Role[]>({
        method: "GET",
        url: "/admin/roles",
    });

    const { mutate: updateUser, isLoading: isUpdatingUser } = useCustomQuery<any, { id: number; username: string; password?: string; role: string; permissions?: string[] }>({
        method: "PUT",
        url: "/admin/users/{id}",
        onSuccess: () => {
            message.success("User updated successfully");
            refetchUsers();
            refetchRoles();
            setIsModalOpen(false);
            setEditPassword('');
        },
        onError: (err: Error) => {
            message.error("Failed to update user: " + err.message);
        }
    });

    const { mutate: deleteUser } = useCustomQuery<any, { id: number }>({
        method: "DELETE",
        url: "/admin/users/{id}",
        onSuccess: () => {
            message.success("User deleted successfully");
            refetchUsers();
        },
        onError: (err: Error) => {
            message.error("Failed to delete user: " + err.message);
        }
    });

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setEditUsername(user.username);
        setEditPassword('');
        const currentRoleName = user.role?.name || '';
        setNewRoleName(currentRoleName);
        setSelectValue(currentRoleName);
        setIsModalOpen(true);
    };

    const handleSaveUser = () => {
        if (!editingUser) return;
        if (!editUsername.trim()) {
            message.error("Username is required");
            return;
        }
        if (selectValue === 'NEW_ROLE') {
            if (!newRoleName.trim()) {
                message.error("Role name is required");
                return;
            }
            if (newRoleName.toLowerCase() === 'user') {
                message.error("Cannot create duplicate 'User' role. Please select the existing User role.");
                return;
            }
        }

        updateUser({
            id: editingUser.id,
            username: editUsername,
            password: editPassword || undefined,
            role: newRoleName
        });
    };

    const handleDeleteUser = (id: number) => {
        deleteUser({ id });
    };

    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        },
        {
            title: 'Username',
            dataIndex: 'username',
            key: 'username',
        },
        {
            title: 'Current Role',
            key: 'role',
            render: (record: User) => <Tag color={record.role?.slug === 'ADMIN' ? 'gold' : 'blue'}>{record.role?.name}</Tag>
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: User) => (
                <Space>
                    <Button
                        type="primary"
                        icon={<EditOutlined />}
                        size="small"
                        onClick={() => handleEditUser(record)}
                        disabled={record.role?.slug === 'ADMIN'}
                    >
                        Edit
                    </Button>
                    {record.role?.slug !== 'ADMIN' && (
                        <Popconfirm
                            title="Delete User"
                            description="Are you sure you want to delete this user?"
                            onConfirm={() => handleDeleteUser(record.id)}
                            okText="Yes"
                            cancelText="No"
                        >
                            <Button type="primary" danger icon={<DeleteOutlined />} size="small">
                                Delete
                            </Button>
                        </Popconfirm>
                    )}
                </Space>
            ),
        },
    ];

    if (usersLoading || rolesLoading) {
        return <div>Loading...</div>
    }

    const filteredUsers = users?.filter(u => {
        if (selectedRoleFilter) {
            return u.role?.slug === selectedRoleFilter;
        }
        return true;
    });

    return (
        <AdminUsersStyled>
            <div className="users-header">
                <h2>User Management</h2>
                <Space>
                    <span>Filter by Role:</span>
                    <div className="filter-select">
                        <Select
                            allowClear
                            placeholder="All Roles"
                            onChange={setSelectedRoleFilter}
                            options={roles?.map(r => ({ label: r.name, value: r.slug }))}
                        />
                    </div>
                </Space>
            </div>

            <Table
                dataSource={filteredUsers}
                columns={columns}
                rowKey="id"
            />

            <Drawer
                title={`Edit User: ${editingUser?.username}`}
                width={500}
                onClose={() => setIsModalOpen(false)}
                open={isModalOpen}
                extra={
                    <Space>
                        <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
                        <Button type="primary" onClick={handleSaveUser} loading={isUpdatingUser}>
                            Save
                        </Button>
                    </Space>
                }
            >
                <div className="drawer-form">
                    <div>
                        <p>Username:</p>
                        <Input
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            placeholder="Username"
                        />
                    </div>

                    <div>
                        <p>New Password (leave empty to keep current):</p>
                        <Input.Password
                            value={editPassword}
                            onChange={(e) => setEditPassword(e.target.value)}
                            placeholder="New Password"
                        />
                    </div>

                    <div className="role-section">
                        <p>Role:</p>
                        <Select
                            value={selectValue}
                            onChange={(value) => {
                                setSelectValue(value);
                                if (value !== 'NEW_ROLE') {
                                    setNewRoleName(value);
                                } else {
                                    setNewRoleName('');
                                }
                            }}
                            placeholder="Select a role"
                        >
                            {roles?.filter(r => r.slug !== 'ADMIN').map(r => (
                                <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
                            ))}
                            <Select.Option value="NEW_ROLE">+ Create New Role</Select.Option>
                        </Select>

                        {selectValue === 'NEW_ROLE' && (
                            <Input
                                value={newRoleName}
                                onChange={(e) => setNewRoleName(e.target.value)}
                                placeholder="Enter new role name"
                            />
                        )}
                        <small className="role-hint">
                            {selectValue === 'NEW_ROLE'
                                ? "Enter the name for the new role. Permissions can be assigned on the Permissions page."
                                : "Select an existing role to assign."}
                        </small>
                    </div>
                </div>
            </Drawer>
        </AdminUsersStyled>
    )
}
