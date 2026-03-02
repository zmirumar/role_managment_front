import styled from "styled-components";

export const AdminUsersStyled = styled.div`
  padding: 24px;

  h1 {
    margin-bottom: 24px;
  }

  .users-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
  }

  .filter-select {
    .ant-select {
      width: 200px;
    }
  }

  .drawer-form {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .role-section {
    margin-bottom: 16px;

    .ant-select {
      width: 100%;
      margin-bottom: 8px;
    }
  }

  .role-hint {
    color: #888;
    font-size: 13px;
  }
`;
