'use client';
import styled from '@emotion/styled';
import { Row } from '@/components/common';
import { theme } from '@/styles/theme';

export const Container = styled(Row)`
  width: 100%;
  padding: 12px 24px;
  border-bottom: 1px solid ${theme.colors.natural[200]};
`;