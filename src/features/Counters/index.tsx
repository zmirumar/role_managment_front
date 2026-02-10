import { useState } from "react";
import { Tabs, Button, Space, Statistic, Row, Col, Card } from "antd";

const Counters = () => {
    const [activeTab, setActiveTab] = useState("1");
    const [counts, setCounts] = useState<{ [key: string]: number }>({
        "1": 0,
        "2": 0,
        "3": 0,
    });

    const increment = (key: string) => {
        setCounts((prev) => ({ ...prev, [key]: prev[key] + 1 }));
    };

    const decrement = (key: string) => {
        setCounts((prev) => ({ ...prev, [key]: Math.max(0, prev[key] - 1) }));
    };

    const renderCounter = (key: string) => (
        <Card bordered={false} style={{ textAlign: 'center', background: 'transparent' }}>
            <Statistic title={`Counter ${key} Value`} value={counts[key]} />
            <Space style={{ marginTop: 20 }}>
                <Button type="primary" onClick={() => increment(key)}>Increment</Button>
                <Button onClick={() => decrement(key)}>Decrement</Button>
            </Space>
        </Card>
    );

    const items = [
        {
            key: "1",
            label: "Counter 1",
            children: (
                <div style={{ padding: '20px' }}>
                    <h1>Counter One</h1>
                    <p>This is the first counter tab.</p>
                    {renderCounter("1")}
                </div>
            ),
        },
        {
            key: "2",
            label: "Counter 2",
            children: (
                <div style={{ padding: '20px' }}>
                    <h2>Counter Two</h2>
                    <p>Example item: Banana</p>
                    {renderCounter("2")}
                </div>
            ),
        },
        {
            key: "3",
            label: "Counter 3",
            children: (
                <div style={{ padding: '20px' }}>
                    <h3>Counter Three</h3>
                    <p>Example item: Apple</p>
                    {renderCounter("3")}
                </div>
            ),
        },
    ];

    return (
        <div style={{ padding: '24px', background: '#fff', minHeight: '360px' }}>
            <Row justify="center">
                <Col span={24}>
                    <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
                </Col>
            </Row>
        </div>
    );
};

export default Counters;
