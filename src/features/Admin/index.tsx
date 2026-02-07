import { Table, Select, message, Checkbox, Card, Row, Col, Divider, Drawer, Input, Button, Tag, Space, Popconfirm } from 'antd'
import { useState } from 'react';
import { useCustomQuery } from '../../hooks/CustomQuery/useCustomQuery';
import { AdminContainer, PermissionItem } from './styles';
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

function AdminDash() {
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const [editUsername, setEditUsername] = useState<string>('');
  const [editPassword, setEditPassword] = useState<string>('');
  const [newRoleName, setNewRoleName] = useState<string>('');
  const [selectValue, setSelectValue] = useState<string>('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const { data: users, isLoading: usersLoading, refetch: 
    refetchUsers } = useCustomQuery<User[]>({
    method: "GET",
    url: "/admin/users",
  });

  const { data: roles, isLoading: rolesLoading, refetch: refetchRoles } = useCustomQuery<Role[]>({
    method: "GET",
    url: "/admin/roles",
  });

  const { mutate: updateUser, isLoading: isUpdatingUser } = useCustomQuery<any, { id: number; username: string; password?: string; role: string; permissions: string[] }>({
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

  const { mutate: updatePermissions, isLoading: isUpdatingPermissions } = useCustomQuery<any, { id: number, permissions: string[] }>({
    method: "PUT",
    url: "/admin/roles/{id}/permissions",
    onSuccess: () => {
      message.success("Permissions updated successfully");
      refetchRoles();
    },
    onError: (err) => {
      message.error("Failed to update permissions: " + err.message);
    }
  });

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setEditUsername(user.username);
    setEditPassword('');
    const currentRoleName = user.role?.name || '';
    setNewRoleName(currentRoleName);
    setSelectValue(currentRoleName);
    setNewRolePermissions(user.role?.permissions.map(p => p.slug) || []);
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
      role: newRoleName,
      permissions: newRolePermissions
    });
  };

  const handleDeleteUser = (id: number) => {
    deleteUser({ id });
  };

  const toggleModalPermission = (permSlug: string, checked: boolean) => {
    if (checked) {
      setNewRolePermissions(prev => [...prev, permSlug]);
    } else {
      setNewRolePermissions(prev => prev.filter(p => p !== permSlug));
    }
  };


  const handleGlobalPermissionChange = (roleId: number, permissionSlug: string, checked: boolean, currentPermissions: Permission[]) => {
    let newPermissions = currentPermissions.map(p => p.slug);
    if (checked) {
      newPermissions.push(permissionSlug);
    } else {
      newPermissions = newPermissions.filter(p => p !== permissionSlug);
    }
    updatePermissions({ id: roleId, permissions: newPermissions });
  };

  const allPermissions = ['post.read', 'post.create', 'post.edit', 'post.delete'];

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

  const displayRoles = roles || [];

  return (
    <AdminContainer>


      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2>User Management</h2>
        <Space>
          <span>Filter by Role:</span>
          <Select
            style={{ width: 200 }}
            allowClear
            placeholder="All Roles"
            onChange={setSelectedRoleFilter}
            options={roles?.map(r => ({ label: r.name, value: r.slug }))}
          />
        </Space>
      </div>

      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
      />

      <Divider />

      <h1>Role Permissions Management</h1>
      <Row gutter={[16, 16]}>
        {displayRoles.map(role => {
          const isAdmin = role.slug === 'ADMIN';
          return (
            <Col span={8} key={role.id}>
              <Card title={role.name} bordered={true} extra={isAdmin ? <Tag color="gold">Locked</Tag> : null}>
                {allPermissions.map(perm => (
                  <PermissionItem key={perm}>
                    <Checkbox
                      checked={isAdmin ? true : role.permissions.some(p => p.slug === perm)}
                      onChange={(e) => handleGlobalPermissionChange(role.id, perm, e.target.checked, role.permissions)}
                      disabled={isAdmin || isUpdatingPermissions}
                    >
                      {perm.replace('.', ' ').toUpperCase()}
                    </Checkbox>
                  </PermissionItem>
                ))}
              </Card>
            </Col>
          )
        })}
      </Row>

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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

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

          <Divider>Role & Permissions</Divider>

          <div style={{ marginBottom: 16 }}>
            <p>Role:</p>
            <Select
              style={{ width: '100%', marginBottom: 8 }}
              value={selectValue}
              onChange={(value) => {
                setSelectValue(value);
                if (value !== 'NEW_ROLE') {
                  setNewRoleName(value);
                  const selectedRole = roles?.find(r => r.name === value);
                  if (selectedRole) {
                    setNewRolePermissions(selectedRole.permissions.map(p => p.slug));
                  }
                } else {
                  setNewRoleName('');
                  setNewRolePermissions([]);
                }
              }}
              placeholder="Select a role"
            >
              {roles?.filter(r => r.slug !== 'ADMIN').map(r => (
                <Select.Option key={r.id} value={r.name}>{r.name}</Select.Option>
              ))}
              <Select.Option value="NEW_ROLE" style={{ fontWeight: 'bold', color: '#1890ff' }}>+ Create New Role</Select.Option>
            </Select>

            {selectValue === 'NEW_ROLE' && (
              <Input
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                placeholder="Enter new role name"
              />
            )}
            <small style={{ color: '#888' }}>
              {selectValue === 'NEW_ROLE'
                ? "Enter the name for the new role."
                : "Select an existing role to assign."}
            </small>
          </div>

          <div>
            <p>Permissions for this Role:</p>
            {allPermissions.map(perm => {
              const isChecked = newRolePermissions.includes(perm);
              return (
                <PermissionItem key={perm}>
                  <Checkbox
                    checked={isChecked}
                    onChange={(e) => toggleModalPermission(perm, e.target.checked)}
                  >
                    {perm.replace('.', ' ').toUpperCase()}
                  </Checkbox>
                </PermissionItem>
              )
            })}
          </div>
        </div>
      </Drawer>

    </AdminContainer >
  )
}

export default AdminDash;
