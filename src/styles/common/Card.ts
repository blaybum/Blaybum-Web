'user client';
import styled from '@emotion/styled';
import { Stack } from '@/components/common';
import { theme } from '@/styles/theme';

export const Card = styled(Stack)`
  padding: 20px;
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;
  background-color: ${theme.colors.bg['primary']};
`;