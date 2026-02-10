'use client';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

type ButtonSize = 'md' | 'sm';
type ButtonColor = 'primary' | 'muted';

const getButtonSize = (
  size: ButtonSize,
) => {
  switch (size) {
    case 'md':
      return `
        width: 100%;
        padding: 12px 16px;
        border-radius: 12px;
      `;
    case 'sm':
      return `
        padding: 8px 12px;
        font-weight: 400;
        border-radius: 8px;
      `;
  }
}

const getButtonColor = (
  color: ButtonColor,
) => {
  switch (color) {
    case 'primary':
      return `
        color: ${theme.colors.white};
        border: none;
        background-color: ${theme.colors.primary[500]};

        &:hover {
          background-color: ${theme.colors.primary[600]};
        }
      `;
    case 'muted':
      return `
        color: ${theme.colors.black};
        border: 1px solid ${theme.colors.natural[200]};
        background-color: ${theme.colors.bg['primary']};

        &:hover {
          background-color: ${theme.colors.bg['secondary']};
        }
      `;
  }
}

export const Button = styled.button<{
  size: ButtonSize;
  color: ButtonColor;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 500;
  transition: 0.1s;
  ${({ size }) => getButtonSize(size)}
  ${({ color }) => getButtonColor(color)}
`;