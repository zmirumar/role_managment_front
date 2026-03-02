import { Card, Select, Table, message, Tag } from "antd";
import { useCustomQuery } from "../../../hooks/CustomQuery/useCustomQuery";
import { AdminPagesStyled } from "./style";
import { useState, useEffect } from "react";

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

const PAGES = [
  { title: 'Create Post Page', slug: 'post.create' },
  { title: 'Counters Page', slug: 'page.counters' },
  { title: 'Fruits Page', slug: 'page.fruits' },
  { title: 'Technologies Page', slug: 'page.technologies' },
];

function AdminPages() {
  const [pageRoles, setPageRoles] = useState<Record<string, number[]>>({});

  const { data: roles, isLoading: rolesLoading, refetch: refetchRoles } = useCustomQuery<Role[]>({
    method: "GET",
    url: "/admin/roles",
  });

  const { mutate: updatePermissions, isLoading: isUpdatingPermissions } = useCustomQuery<any, { id: number, permissions: string[] }>({
    method: "PUT",
    url: "/admin/roles/{id}/permissions",
    onSuccess: () => {
      message.success("Page access updated successfully");
      refetchRoles();
    },
    onError: (err) => {
      message.error("Failed to update page access: " + err.message);
    }
  });

  useEffect(() => {
    if (roles) {
      const initialPageRoles: Record<string, number[]> = {};
      PAGES.forEach(page => {
        initialPageRoles[page.slug] = [];
      });

      roles.forEach(role => {
        if (role.slug !== 'ADMIN') {
          role.permissions.forEach(perm => {
            if (initialPageRoles[perm.slug] !== undefined) {
              initialPageRoles[perm.slug].push(role.id);
            }
          });
        }
      });
      setPageRoles(initialPageRoles);
    }
  }, [roles]);

  const handleRoleChange = (pageSlug: string, newRoleIds: number[]) => {
    if (!roles) return;

    setPageRoles(prev => ({ ...prev, [pageSlug]: newRoleIds }));

    const oldRoleIds = pageRoles[pageSlug] || [];

    const addedRoles = newRoleIds.filter(id => !oldRoleIds.includes(id));
    const removedRoles = oldRoleIds.filter(id => !newRoleIds.includes(id));

    [...addedRoles, ...removedRoles].forEach(roleId => {
      const role = roles.find(r => r.id === roleId);
      if (!role) return;

      let currentPermissions = role.permissions.map(p => p.slug);

      if (addedRoles.includes(roleId)) {
        if (!currentPermissions.includes(pageSlug)) {
          currentPermissions.push(pageSlug);
        }
      } else {
        currentPermissions = currentPermissions.filter(p => !p.startsWith(pageSlug) && p !== pageSlug);

        if (pageSlug === 'page.fruits') {
          currentPermissions = currentPermissions.filter(p => !p.startsWith('tab.fruits'));
        }
        if (pageSlug === 'page.technologies') {
          currentPermissions = currentPermissions.filter(p => !p.startsWith('tab.technologies') && !p.startsWith('button.technologies'));
        }
      }

      updatePermissions({ id: roleId, permissions: currentPermissions });
    });
  };

  const columns = [
    {
      title: 'Page',
      dataIndex: 'title',
      key: 'title',
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Allowed Roles',
      dataIndex: 'slug',
      key: 'slug',
      render: (slug: string) => {
        const options = roles
          ?.filter(role => role.slug !== 'ADMIN')
          .map(role => ({
            label: role.name,
            value: role.id
          })) || [];

        return (
          <div className="page-select">
            <Select
              mode="multiple"
              allowClear
              placeholder="Select roles that can access this page"
              options={options}
              value={pageRoles[slug] || []}
              onChange={(newRoleIds) => handleRoleChange(slug, newRoleIds as number[])}
              disabled={rolesLoading || isUpdatingPermissions}
            />
          </div>
        );
      }
    },
    {
      title: 'Admin Access',
      key: 'admin',
      render: () => <Tag color="gold">Always Included</Tag>
    }
  ];

  return (
    <AdminPagesStyled>
      <h1>Admin Page Control</h1>
      <Card>
        <Table
          dataSource={PAGES.map((p, index) => ({ ...p, key: index }))}
          columns={columns}
          pagination={false}
          loading={rolesLoading}
        />
      </Card>
    </AdminPagesStyled>
  );
}

export default AdminPages;
