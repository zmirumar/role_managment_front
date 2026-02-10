import { Layout } from 'antd';
import Sidebar from '../Sidebar';
import styled from 'styled-components';
import React from 'react';

const { Content } = Layout;

const InnerContent = styled.div`
  padding: 24px;
  background: #f0f2f5; 
  min-height: 100vh;
`;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            <Layout>
                <Content>
                    <InnerContent>
                        {children}
                    </InnerContent>
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;
