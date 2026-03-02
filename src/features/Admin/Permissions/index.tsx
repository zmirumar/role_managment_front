import { message, Checkbox, Card, Row, Col, Tag, Divider } from 'antd'
import { useCustomQuery } from '../../../hooks/CustomQuery/useCustomQuery';
import { PermissionsStyled } from './style';

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

    const formatPermissionName = (slug: string): string => {
        const nameMap: { [key: string]: string } = {
            'post.read': 'Read Posts',
            'post.create': 'Create Posts',
            'post.edit': 'Edit Posts',
            'post.delete': 'Delete Posts',
            'page.counters': 'Counters Page Access',
            'page.fruits': 'Fruits Page Access',
            'tab.fruits.apple': 'Access Apple Tab',
            'tab.fruits.watermelon': 'Access Watermelon Tab',
            'page.technologies': 'Technologies Page Access',
            'tab.technologies.react': 'Access React Tab',
            'tab.technologies.php': 'Access PHP Tab',
            'tab.technologies.postgres': 'Access Postgres Tab',
            'tab.technologies.antd': 'Access AntD Tab',
            'tab.technologies.typescript': 'Access TypeScript Tab',
            'button.technologies.react': 'View React Button',
            'button.technologies.php': 'View PHP Button',
            'button.technologies.postgres': 'View Postgres Button',
            'button.technologies.antd': 'View AntD Button',
            'button.technologies.typescript': 'View TypeScript Button',
        };

        return nameMap[slug] || slug.replace(/[._]/g, ' ').toUpperCase();
    };

    const permissionGroups = [
        {
            title: "Post Permissions",
            basePermission: "post.create",
            permissions: ['post.read', 'post.create', 'post.edit', 'post.delete']
        },
        {
            title: "Counters Page",
            basePermission: "page.counters",
            permissions: []
        },
        {
            title: "Fruits Page",
            basePermission: "page.fruits",
            permissions: ['tab.fruits.apple', 'tab.fruits.watermelon']
        },
        {
            title: "Technologies Page",
            basePermission: "page.technologies",
            permissions: [
                'tab.technologies.react',
                'tab.technologies.php',
                'tab.technologies.postgres',
                'tab.technologies.antd',
                'tab.technologies.typescript',
                'button.technologies.react',
                'button.technologies.php',
                'button.technologies.postgres',
                'button.technologies.antd',
                'button.technologies.typescript',
            ]
        }
    ];

    const displayRoles = roles || [];

    if (rolesLoading) {
        return <div>Loading...</div>
    }

    return (
        <PermissionsStyled>
            <h1>Role Permissions Management</h1>
            <p className="notice">
                Notice: Sub-permissions (tabs, buttons) are only configurable here if the role has been granted access to the base Page via the Admin Pages table.
            </p>

            <Row gutter={[16, 16]}>
                {displayRoles.map(role => {
                    const isAdmin = role.slug === 'ADMIN';
                    const rolePermSlugs = role.permissions.map(p => p.slug);

                    return (
                        <Col span={8} key={role.id}>
                            <Card title={role.name} bordered={true} extra={isAdmin ? <Tag color="gold">Locked</Tag> : null}>
                                {permissionGroups.map(group => {
                                    const hasBaseAccess = isAdmin || rolePermSlugs.includes(group.basePermission);

                                    if (!hasBaseAccess) {
                                        return null;
                                    }

                                    return (
                                        <div className="permission-group" key={group.title}>
                                            <h4>{group.title}</h4>
                                            {group.permissions.length === 0 ? (
                                                <span className="empty-permissions">No sub-permissions.</span>
                                            ) : (
                                                group.permissions.map(perm => (
                                                    <div className="permission-item" key={perm}>
                                                        <Checkbox
                                                            checked={isAdmin ? true : rolePermSlugs.includes(perm)}
                                                            onChange={(e) => handleGlobalPermissionChange(role.id, perm, e.target.checked, role.permissions)}
                                                            disabled={isAdmin || isUpdatingPermissions}
                                                        >
                                                            {formatPermissionName(perm)}
                                                        </Checkbox>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    )
                                })}
                            </Card>
                        </Col>
                    )
                })}
            </Row>

            <Divider />
        </PermissionsStyled>
    )
}
