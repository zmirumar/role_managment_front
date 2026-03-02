import { Layout } from 'antd';
import Sidebar from '../Sidebar';
import React from 'react';
import { LayoutStyled } from './style';

const { Content } = Layout;

const MainLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <LayoutStyled>
            <Sidebar />
            <Layout>
                <Content>
                    <div className="inner-content">
                        {children}
                    </div>
                </Content>
            </Layout>
        </LayoutStyled>
    );
};

export default MainLayout;
