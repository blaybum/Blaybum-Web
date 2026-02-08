'use client';
import styled from '@emotion/styled';
import { Stack } from '@/components/common';
import { theme } from '@/styles/theme';

export const Container = styled(Stack)`
  width: 17rem;
  height: 100vh;
  padding: 20px;
  color: ${theme.colors.natural[700]};
  border-right: 1px solid ${theme.colors.natural[200]};
  box-sizing: border-box;
`;

export const Profile = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 9999px;
  background-color: ${theme.colors.natural[200]};
  overflow: hidden;
`;