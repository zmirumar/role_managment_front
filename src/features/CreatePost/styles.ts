import styled from 'styled-components';

export const FormContainer = styled.div<{ $isEdit?: boolean }>`
  margin-bottom: ${props => props.$isEdit ? '0' : '20px'};
  padding: ${props => props.$isEdit ? '0' : '20px'};
  border: ${props => props.$isEdit ? 'none' : '1px solid #f0f0f0'};
  border-radius: 8px;

  h2 {
    margin-bottom: 20px;
  }
`;
