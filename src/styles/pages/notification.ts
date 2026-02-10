'use client';
import styled from '@emotion/styled';
import { Row, Stack } from '@/components/common';
import { theme } from '@/styles/theme';

export const Container = styled(Stack)`
  padding: 28px;
  background-color: ${theme.colors.natural[100]};
  min-height: 100%;
  width: 100%;
`;

export const SummaryCard = styled(Stack)`
  box-sizing: border-box;
  flex: 1;
  padding: 20px;
  gap: 4px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.natural[200]};
  background: ${theme.colors.bg.primary};
  align-items: center;
`;

export const FilterRow = styled(Row)`
  width: 100%;
  gap: 8px;
  padding: 4px;
  border-radius: 8px;
  background: ${theme.colors.bg.primary};
  border: 1px solid ${theme.colors.natural[200]};
`;

export const FilterTab = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: 0.15s;

  background: ${({ active }) =>
    active ? theme.colors.primary[500] : 'transparent'};
  color: ${({ active }) =>
    active ? theme.colors.white : theme.colors.natural[700]};

  &:hover {
    background: ${({ active }) =>
      active ? theme.colors.primary[600] : theme.colors.natural[100]};
  }
`;

export const RequestCard = styled(Stack)`
  box-sizing: border-box;
  width: 100%;
  padding: 24px;
  gap: 16px;
  background: ${theme.colors.bg.primary};
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;
`;

export const RequestHeader = styled(Row)`
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
`;

export const RequestAvatar = styled.div<{ src?: string }>`
  width: 48px;
  height: 48px;
  border-radius: 9999px;
  border: 2px solid ${theme.colors.natural[200]};
  background-color: ${theme.colors.natural[100]};
  background-image: ${({ src }) => (src ? `url(${src})` : 'none')};
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const StatusPill = styled.span<{
  tone: 'pending' | 'accepted' | 'rejected';
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;

  ${({ tone }) => {
    switch (tone) {
      case 'pending':
        return `
          background: #FFEDD5;
          color: #EA580C;
        `;
      case 'accepted':
        return `
          background: #F0FDF4;
          color: #16A34A;
        `;
      case 'rejected':
        return `
          background: #FEE2E2;
          color: #DC2626;
        `;
    }
  }}
`;

export const MessageBox = styled.div`
  width: 100%;
  padding: 14px 16px;
  border-radius: 8px;
  background: ${theme.colors.natural[100]};
  font-size: 14px;
  line-height: 22px;
  color: #212121;
`;

export const RequestFooter = styled(Row)`
  width: 100%;
  padding-top: 16px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid ${theme.colors.natural[200]};
`;

export const AcceptButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  background: ${theme.colors.primary[500]};
  color: ${theme.colors.white};
  font-size: 14px;
  font-weight: 600;
  transition: 0.12s;

  &:hover {
    background: ${theme.colors.primary[600]};
  }
`;

export const RejectButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border: 1px solid ${theme.colors.natural[200]};
  cursor: pointer;
  border-radius: 8px;
  background: ${theme.colors.bg.primary};
  color: #DC2626;
  font-size: 14px;
  font-weight: 600;
  transition: 0.12s;

  &:hover {
    background: #FEF2F2;
  }
`;

export const EmptyState = styled(Stack)`
  width: 100%;
  padding: 48px 24px;
  align-items: center;
  justify-content: center;
  background: ${theme.colors.bg.primary};
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;
`;
