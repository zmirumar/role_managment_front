import { Table, Select, message, Checkbox, Card, Row, Col, Divider } from 'antd'
import { useCustomQuery } from '../../hooks/CustomQuery/useCustomQuery';
import { AdminContainer, PermissionItem } from './styles';

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
  const { data: users, isLoading: usersLoading, refetch: refetchUsers } = useCustomQuery<User[]>({
    method: "GET",
    url: "/admin/users",
  });

  const { data: roles, isLoading: rolesLoading, refetch: refetchRoles } = useCustomQuery<Role[]>({
    method: "GET",
    url: "/admin/roles",
  });

  const { mutate: updateRole, isLoading: isUpdatingRole } = useCustomQuery<any, { id: number, role: string }>({
    method: "PUT",
    url: "/admin/users/{id}/role",
    onSuccess: () => {
      message.success("Role updated successfully");
      refetchUsers();
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

  const handleRoleChange = (userId: number, newRole: string) => {
    updateRole({ id: userId, role: newRole });
  };

  const handlePermissionChange = (roleId: number, permissionSlug: string, checked: boolean, currentPermissions: Permission[]) => {
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
      render: (record: User) => record.role?.slug || 'N/A'
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: User) => (
        <Select
          defaultValue={record.role?.slug}
          style={{ width: 150 }}
          onChange={(value) => handleRoleChange(record.id, value)}
          loading={isUpdatingRole}
          disabled={record.role?.slug === 'OWNER'}
          options={[
            { value: 'USER', label: 'USER' },
            { value: 'ADMIN', label: 'ADMIN' },
            { value: 'SUPERADMIN', label: 'SUPERADMIN' },
          ]}
        >
        </Select>
      ),
    },
  ];

  if (usersLoading || rolesLoading) {
    return <div>Loading...</div>
  }

  const filteredUsers = users?.filter(u => u.role?.slug !== 'OWNER');
  const filteredRoles = roles?.filter(r => r.slug !== 'OWNER');

  return (
    <AdminContainer>
      <h1>User Management</h1>
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
      />

      <Divider />

      <h1>Role Permissions Management</h1>
      <Row gutter={[16, 16]}>
        {filteredRoles?.map(role => (
          <Col span={8} key={role.id}>
            <Card title={role.name} bordered={true}>
              {allPermissions.map(perm => (
                <PermissionItem key={perm}>
                  <Checkbox
                    checked={role.permissions.some(p => p.slug === perm)}
                    onChange={(e) => handlePermissionChange(role.id, perm, e.target.checked, role.permissions)}
                    disabled={isUpdatingPermissions}
                  >
                    {perm.replace('.', ' ').toUpperCase()}
                  </Checkbox>
                </PermissionItem>
              ))}
            </Card>
          </Col>
        ))}
      </Row>
    </AdminContainer>
  )
}

export default AdminDash;
