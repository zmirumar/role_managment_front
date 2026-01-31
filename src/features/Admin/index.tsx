import { Table, Select, message, Checkbox, Card, Row, Col, Divider, Modal, Input, Statistic, Button, Tag, Space } from 'antd'
import { useState, useMemo } from 'react';
import { useCustomQuery } from '../../hooks/CustomQuery/useCustomQuery';
import { AdminContainer, PermissionItem } from './styles';
import { UserOutlined, SafetyCertificateOutlined } from '@ant-design/icons';

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newRoleName, setNewRoleName] = useState('');
  const [newRolePermissions, setNewRolePermissions] = useState<string[]>([]);

  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useCustomQuery<User[]>({
    method: "GET",
    url: "/admin/users",
  });

  const { data: roles, isLoading: rolesLoading, refetch: refetchRoles } = useCustomQuery<Role[]>({
    method: "GET",
    url: "/admin/roles",
  });

  const { mutate: updateRole, isLoading: isUpdatingRole } = useCustomQuery<any, { id: number, role: string, permissions: string[] }>({
    method: "PUT",
    url: "/admin/users/{id}/role",
    onSuccess: () => {
      message.success("Role and permissions updated successfully");
      refetchUsers();
      refetchRoles(); // Refetch roles as new one might be created
      setIsModalOpen(false);
    },
    onError: (err) => {
      message.error("Failed to update role: " + err.message);
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
    setNewRoleName(user.role?.name || '');
    setNewRolePermissions(user.role?.permissions.map(p => p.slug) || []);
    setIsModalOpen(true);
  };

  const handleSaveUserRole = () => {
    if (!editingUser) return;
    if (!newRoleName.trim()) {
      message.error("Role name is required");
      return;
    }

    // Now we send both role name and the selected permissions
    updateRole({
      id: editingUser.id,
      role: newRoleName,
      permissions: newRolePermissions
    });
  };

  const toggleModalPermission = (permSlug: string, checked: boolean) => {
    if (checked) {
      setNewRolePermissions(prev => [...prev, permSlug]);
    } else {
      setNewRolePermissions(prev => prev.filter(p => p !== permSlug));
    }
  };

  const currentRolePermissions = useMemo(() => {
    // Find the role matching newRoleName to show its current permissions if it exists
    // This helps the user see what they are assigning.
    const existingRole = roles?.find(r => r.name.toLowerCase() === newRoleName.toLowerCase() || r.slug.toLowerCase() === newRoleName.toLowerCase());
    return existingRole ? existingRole.permissions.map(p => p.slug) : [];
  }, [roles, newRoleName]);


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
        <Button
          type="link"
          onClick={() => handleEditUser(record)}
          disabled={record.role?.slug === 'ADMIN'}
        >
          Edit Role
        </Button>
      ),
    },
  ];

  if (usersLoading || rolesLoading) {
    return <div>Loading...</div>
  }

  // Statistics
  const totalUsers = users?.length || 0;
  const adminCount = users?.filter(u => u.role?.slug === 'ADMIN').length || 0;
  const userCount = users?.filter(u => u.role?.slug === 'USER').length || 0;

  // Filter
  const filteredUsers = users?.filter(u => {
    if (selectedRoleFilter) {
      return u.role?.slug === selectedRoleFilter;
    }
    return true;
  });

  // Bottom Panel: Show ADMIN (disabled) and others (enabled)
  // Requirement: "show only a Admin(Current Owner) ... and we should allow all of cheboxes and couse we are admin and make this cheboex un changeble, and there we should show only a users permisions what they can do that is so."
  // Wait, the prompt says "show only a Admin... and we should show only a users permisions".
  // I interpret this as: Show ADMIN column/card (all checked, disabled) AND show other roles (USER, etc) as editable.
  // Actually, standard Admin dashboards usually show all roles.
  // Let's filter roles to show.
  const displayRoles = roles || [];

  return (
    <AdminContainer>
      <h1>Dashboard Overview</h1>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Total Users" value={totalUsers} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Admins" value={adminCount} prefix={<SafetyCertificateOutlined />} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Standard Users" value={userCount} prefix={<UserOutlined />} />
          </Card>
        </Col>
      </Row>

      <Divider />

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

      <Modal
        title={`Edit Role for ${editingUser?.username}`}
        open={isModalOpen}
        onOk={handleSaveUserRole}
        onCancel={() => setIsModalOpen(false)}
        confirmLoading={isUpdatingRole}
      >
        <div style={{ marginBottom: 16 }}>
          <p>Role Name:</p>
          <Input
            value={newRoleName}
            onChange={(e) => setNewRoleName(e.target.value)}
            placeholder="Enter role name (e.g. Editor)"
          />
        </div>

        {/* 
            Note: As per "one input to role name to that user and botttom of this input should be a chechboxes with every permisions"
            However, we are updating the User's ROLE, not directly the user's permissions (since permissions are attached to Roles).
            If the user types a new Role Name (e.g. 'Manager'), we create/assign that role.
            If we want to also set permissions for 'Manager' right here, we need to know if 'Manager' role exists.
            
            Visual Feedback: Show permissions of the typed role name if it exists.
        */}
        <div>
          <p>Permissions associated with this role:</p>
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
      </Modal>

    </AdminContainer>
  )
}

export default AdminDash;
