'use client'
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { Row, Stack } from '@/components';

export const Panel = styled(Stack)`
  width: 50vw;
  padding: 0 80px;
  color: ${theme.colors.primary[500]};
  background: linear-gradient(
    to right,
    ${theme.colors.primary[100]},
    ${theme.colors.bg['primary']},
    ${theme.colors.primary[100]}
  );
`;

export const Card = styled(Row)`
  width: 100%;
  padding: 20px;
  border: 1px solid ${theme.colors.primary[100]};
  border-radius: 16px;
  background-color: ${theme.colors.bg['primary']};
`;