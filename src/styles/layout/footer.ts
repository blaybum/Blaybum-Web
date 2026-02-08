'use client';
import styled from '@emotion/styled';
import { Row, Stack, Txt } from '@/components/common';
import { theme } from '@/styles/theme';

export const Container = styled(Stack)`
  padding: 2rem 8rem;
  border-top: 1px solid ${theme.colors.natural[200]};
  background-color: ${theme.colors.bg['secondary']};
`;

export const Header = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
`;

export const HeaderLeft = styled(Row)`justify-self: start;`;
export const HeaderCenter = styled(Row)`justify-self: centert;`;
export const HeaderRight = styled(Txt)`justify-self: end;`;