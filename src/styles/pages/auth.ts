'use client';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import { Row, Stack } from '@/components/common';

export const Container = styled(Row)`
  min-height: 100vh;
  width: 100%;
`;

export const Panel = styled(Stack)`
  width: 50vw;
  padding: 0 6.2rem;
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
  color: ${theme.colors.natural[200]};
  border: 1px solid ${theme.colors.primary[100]};
  border-radius: 16px;
  background-color: ${theme.colors.bg['primary']};
`;

export const Info = styled(Row)`
  width: 100%;
  padding: 20px;
  border-radius: 16px;
  background-color: ${theme.colors.bg['secondary']};
`;

export const Form = styled(Stack)`
  width: 50vw;
  padding: 8rem 6.2rem;
`;

export const Checkbox = styled.input`
  width: 16px;
  height: 16px;
`;

export const Oauth = styled(Row)`
  width: 100%;
  padding: 12px;
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;

  transition: 0.1s;

  &:hover {
    background-color: ${theme.colors.natural[100]};
  }
`;