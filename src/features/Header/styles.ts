import styled from 'styled-components';
import { Layout } from 'antd';

const { Header: AntHeader } = Layout;

export const StyledHeader = styled(AntHeader)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
  padding: 0 20px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  margin-bottom: 20px;
`;

export const Logo = styled.div`
  font-size: 20px;
  font-weight: bold;
  cursor: pointer;
`;

export const UserInfo = styled.div`
  margin-right: 10px;
`;
