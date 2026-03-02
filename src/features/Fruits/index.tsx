import { useState } from "react";
import { Tabs, Card, Typography } from "antd";
import { useAuthStore } from "../../store/useAuthStore";
import { FruitsStyled } from "./style";

const { Title } = Typography;

const Fruits = () => {
    const [activeTab, setActiveTab] = useState("1");
    const { permissions, user } = useAuthStore();

    const canSeeApple = user?.role === 'ADMIN' || permissions['tab.fruits.apple'];
    const canSeeWatermelon = user?.role === 'ADMIN' || permissions['tab.fruits.watermelon'];

    const items = [
        ...(canSeeApple ? [{
            key: "1",
            label: "Apple",
            children: (
                <Card>
                    <Title level={2}>Apple</Title>
                </Card>
            ),
        }] : []),
        ...(canSeeWatermelon ? [{
            key: "2",
            label: "Watermelon",
            children: (
                <Card>
                    <Title level={2}>Watermelon</Title>
                </Card>
            ),
        }] : []),
    ];

    return (
        <FruitsStyled>
            <Title level={1}>Fruits Selection</Title>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
        </FruitsStyled>
    );
};

export default Fruits;
