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

export const SectionCard = styled(Stack)`
  box-sizing: border-box;
  width: 100%;
  padding: 24px;
  gap: 20px;
  background: ${theme.colors.bg.primary};
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;
`;

export const SectionHeader = styled(Row)`
  width: 100%;
  align-items: center;
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.colors.natural[200]};
`;

export const ProfileAvatar = styled.div<{ src?: string }>`
  width: 80px;
  height: 80px;
  border-radius: 9999px;
  border: 2px solid ${theme.colors.natural[200]};
  background-color: ${theme.colors.natural[100]};
  background-image: ${({ src }) => (src ? `url(${src})` : 'none')};
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
  flex-shrink: 0;
`;

export const AvatarEditButton = styled.button`
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  border-radius: 9999px;
  border: 2px solid ${theme.colors.bg.primary};
  background: ${theme.colors.primary[500]};
  color: ${theme.colors.white};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 14px;
`;

export const AvatarWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  flex-shrink: 0;
`;

export const FormRow = styled(Row)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const FormLabel = styled.label`
  font-size: 14px;
  font-weight: 500;
  color: #212121;
  min-width: 120px;
`;

export const FormInput = styled.input`
  flex: 1;
  max-width: 360px;
  padding: 10px 14px;
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 8px;
  background: ${theme.colors.bg.primary};
  font-size: 14px;
  color: #212121;
  outline: none;
  transition: border-color 0.15s;

  &:focus {
    border-color: ${theme.colors.primary[500]};
  }

  &:disabled {
    background: ${theme.colors.natural[100]};
    color: ${theme.colors.natural[700]};
  }
`;

export const StatCard = styled(Stack)`
  box-sizing: border-box;
  flex: 1;
  padding: 16px;
  gap: 4px;
  border-radius: 8px;
  background: ${theme.colors.natural[100]};
  align-items: center;
`;

export const ToggleRow = styled(Row)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
  padding: 12px 0;

  &:not(:last-child) {
    border-bottom: 1px solid ${theme.colors.natural[100]};
  }
`;

export const Toggle = styled.button<{ checked: boolean }>`
  width: 44px;
  height: 24px;
  border-radius: 9999px;
  border: none;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
  background-color: ${({ checked }) =>
    checked ? theme.colors.primary[500] : theme.colors.natural[300]};

  &::after {
    content: '';
    position: absolute;
    top: 2px;
    left: ${({ checked }) => (checked ? '22px' : '2px')};
    width: 20px;
    height: 20px;
    border-radius: 9999px;
    background: ${theme.colors.white};
    transition: left 0.2s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
`;

export const SaveButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 32px;
  border: none;
  cursor: pointer;
  border-radius: 8px;
  background: ${theme.colors.primary[500]};
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 600;
  transition: 0.12s;

  &:hover {
    background: ${theme.colors.primary[600]};
  }
`;
