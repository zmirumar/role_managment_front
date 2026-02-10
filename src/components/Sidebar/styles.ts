import styled from 'styled-components';
import { Layout } from 'antd';

const { Sider } = Layout;

export const SidebarContainer = styled(Sider)`
  height: 100vh;
  /* Removed fixed positioning to allow natural layout flow with Ant Design */

  
  .logo {
    height: 32px;
    margin: 16px;
    background: rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: bold;
    font-size: 16px;
    white-space: nowrap;
    overflow: hidden;
    border-radius: 6px;
  }
`;

export const UserInfo = styled.div`
  padding: 12px 16px;
  color: white;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.1);
  
  .username {
    font-weight: bold;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .role {
    font-size: 12px;
    opacity: 0.7;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const BottomSection = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
`;
