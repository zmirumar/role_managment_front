import styled from 'styled-components';

export const PostsContainer = styled.div`
  h1 {
    margin-bottom: 20px;
  }
`;

export const PostCard = styled.div`
  border: 1px solid #f0f0f0;
  padding: 20px;
  margin-bottom: 15px;
  border-radius: 12px;
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
`;

export const PostContent = styled.div`
  flex: 1;

  h2 {
    margin: 0 0 10px 0;
    font-size: 1.4rem;
  }

  p {
    color: #555;
    font-size: 1.05rem;
    line-height: 1.6;
  }
`;

export const ActionSpace = styled.div`
  margin-left: 20px;
`;
