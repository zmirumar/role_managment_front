import { useState } from "react";
import { Tabs, Button, Space, Statistic, Row, Col, Card } from "antd";
import { CountersStyled } from "./style";

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
        <div className="counter-card">
            <Card bordered={false}>
                <Statistic title={`Counter ${key} Value`} value={counts[key]} />
                <Space>
                    <Button type="primary" onClick={() => increment(key)}>Increment</Button>
                    <Button onClick={() => decrement(key)}>Decrement</Button>
                </Space>
            </Card>
        </div>
    );

    const items = [
        {
            key: "1",
            label: "Counter 1",
            children: (
                <div className="tab-content">
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
                <div className="tab-content">
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
                <div className="tab-content">
                    <h3>Counter Three</h3>
                    <p>Example item: Apple</p>
                    {renderCounter("3")}
                </div>
            ),
        },
    ];

    return (
        <CountersStyled>
            <Row justify="center">
                <Col span={24}>
                    <Tabs activeKey={activeTab} onChange={setActiveTab} items={items} />
                </Col>
            </Row>
        </CountersStyled>
    );
};

export default Counters;
