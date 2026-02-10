import { useState } from "react";
import { Tabs, Card, Typography } from "antd";
import { useAuthStore } from "../../store/useAuthStore";

const { Title } = Typography;

const Fruits = () => {
    const [activeTab, setActiveTab] = useState("1");
    const { permissions, user } = useAuthStore();

    // Admin has all permissions, or check for specific permission
    const canSeeApple = user?.role === 'ADMIN' || permissions['tab.fruits.apple'];
    const canSeeWatermelon = user?.role === 'ADMIN' || permissions['tab.fruits.watermelon'];

    const items = [
        ...(canSeeApple ? [{
            key: "1",
            label: "Apple",
            children: (
                <Card style={{ textAlign: 'center' }}>
                    <Title level={2}>Fresh Apple</Title>
                    <img
                        src="https://images.unsplash.com/photo-1560806887-1e4cd0b6bcd6?auto=format&fit=crop&w=600&q=80"
                        alt="Apple"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                </Card>
            ),
        }] : []),
        ...(canSeeWatermelon ? [{
            key: "2",
            label: "Watermelon",
            children: (
                <Card style={{ textAlign: 'center' }}>
                    <Title level={2}>Juicy Watermelon</Title>
                    <img
                        src="https://images.unsplash.com/photo-1587049633562-ad38cb270d6a?auto=format&fit=crop&w=600&q=80"
                        alt="Watermelon"
                        style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
                    />
                </Card>
            ),
        }] : []),
    ];


    return (
        <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
            <Title level={1}>Fruits Selection</Title>
            <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
        </div>
    );
};

export default Fruits;
