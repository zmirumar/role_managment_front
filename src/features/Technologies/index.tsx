import { useState } from "react";
import { Tabs, Card, Typography, Button } from "antd";
import { useAuthStore } from "../../store/useAuthStore";
import { TechnologiesStyled } from "./style";

const { Title } = Typography;

const Technologies = () => {
    const [activeTab, setActiveTab] = useState("1");
    const { permissions, user } = useAuthStore();

    const canSeeReact = user?.role === 'ADMIN' || permissions['tab.technologies.react'];
    const canSeePhp = user?.role === 'ADMIN' || permissions['tab.technologies.php'];
    const canSeePostgres = user?.role === 'ADMIN' || permissions['tab.technologies.postgres'];
    const canSeeAntd = user?.role === 'ADMIN' || permissions['tab.technologies.antd'];
    const canSeeTypescript = user?.role === 'ADMIN' || permissions['tab.technologies.typescript'];

    const canSeeReactButton = user?.role === 'ADMIN' || permissions['button.technologies.react'];
    const canSeePhpButton = user?.role === 'ADMIN' || permissions['button.technologies.php'];
    const canSeePostgresButton = user?.role === 'ADMIN' || permissions['button.technologies.postgres'];
    const canSeeAntdButton = user?.role === 'ADMIN' || permissions['button.technologies.antd'];
    const canSeeTypescriptButton = user?.role === 'ADMIN' || permissions['button.technologies.typescript'];

    const items = [
        ...(canSeeReact ? [{
            key: "1",
            label: "React",
            children: (
                <Card>
                    <Title level={2}>React</Title>
                    {canSeeReactButton && <Button type="primary">React Action</Button>}
                </Card>
            ),
        }] : []),
        ...(canSeePhp ? [{
            key: "2",
            label: "PHP",
            children: (
                <Card>
                    <Title level={2}>PHP</Title>
                    {canSeePhpButton && <Button type="primary">PHP Action</Button>}
                </Card>
            ),
        }] : []),
        ...(canSeePostgres ? [{
            key: "3",
            label: "Postgres",
            children: (
                <Card>
                    <Title level={2}>Postgres</Title>
                    {canSeePostgresButton && <Button type="primary">Postgres Action</Button>}
                </Card>
            ),
        }] : []),
        ...(canSeeAntd ? [{
            key: "4",
            label: "AntD",
            children: (
                <Card>
                    <Title level={2}>AntD</Title>
                    {canSeeAntdButton && <Button type="primary">AntD Action</Button>}
                </Card>
            ),
        }] : []),
        ...(canSeeTypescript ? [{
            key: "5",
            label: "TypeScript",
            children: (
                <Card>
                    <Title level={2}>TypeScript</Title>
                    {canSeeTypescriptButton && <Button type="primary">TypeScript Action</Button>}
                </Card>
            ),
        }] : []),
    ];

    return (
        <TechnologiesStyled>
            <Title level={1}>Technologies Selection</Title>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
        </TechnologiesStyled>
    );
};

export default Technologies;
