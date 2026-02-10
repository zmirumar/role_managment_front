import { message, Checkbox, Card, Row, Col, Tag, Divider } from 'antd'
import { useCustomQuery } from '../../../hooks/CustomQuery/useCustomQuery';
import { AdminContainer, PermissionItem } from '../styles';

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

export default function Permissions() {
    const { data: roles, isLoading: rolesLoading, refetch: refetchRoles } = useCustomQuery<Role[]>({
        method: "GET",
        url: "/admin/roles",
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

    const handleGlobalPermissionChange = (roleId: number, permissionSlug: string, checked: boolean, currentPermissions: Permission[]) => {
        let newPermissions = currentPermissions.map(p => p.slug);
        if (checked) {
            newPermissions.push(permissionSlug);
        } else {
            newPermissions = newPermissions.filter(p => p !== permissionSlug);
        }
        updatePermissions({ id: roleId, permissions: newPermissions });
    };

    // Helper function to format permission display names
    const formatPermissionName = (slug: string): string => {
        const nameMap: { [key: string]: string } = {
            // Post Management
            'post.read': 'Read Posts',
            'post.create': 'Create Posts',
            'post.edit': 'Edit Posts',
            'post.delete': 'Delete Posts',
            'page.counters': 'Counters Page Access',
            'page.fruits': 'Fruits Page Access',
            'tab.fruits.apple': 'Access Apple Tab',
            'tab.fruits.watermelon': 'Access Watermelon Tab',
        };

        return nameMap[slug] || slug.replace(/[._]/g, ' ').toUpperCase();
    };

    // List of all available system permissions
    // Comprehensive list based on backend migrations and seeder
    const allPermissions = [
        // Post Management
        'post.read',
        'post.create',
        'post.edit',
        'post.delete',
        'page.counters',
        'page.fruits',
        'tab.fruits.apple',
        'tab.fruits.watermelon',
    ];

    const displayRoles = roles || [];

    if (rolesLoading) {
        return <div>Loading...</div>
    }

    return (
        <AdminContainer>
            <h1>Role Permissions Management</h1>
            <p>Manage permissions for each role. (Step 1 & 4)</p>

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
                                            {formatPermissionName(perm)}
                                        </Checkbox>
                                    </PermissionItem>
                                ))}
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            <Divider />

            {/* 
        Step 3: "Page" section within Permissions
        This is implicitly handled above by the 'page.*' permissions. 
        Admins can check/uncheck 'page.review' to control access.
      */}

        </AdminContainer>
    )
}
