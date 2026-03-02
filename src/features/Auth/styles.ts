import styled from "styled-components";

export const AuthStyled = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 20px;

  .auth-card {
    width: 100%;
    max-width: 400px;
    padding: 30px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);

    h1 {
      text-align: center;
      margin-bottom: 24px;
    }
  }

  .error-message {
    color: red;
    margin-bottom: 10px;
  }

  .auth-link {
    text-align: center;
    margin-top: 15px;
  }
`;
