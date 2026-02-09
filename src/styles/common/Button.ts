'use client';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

type ButtonColor = 'primary' | 'muted';

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
  color: ButtonColor;
}>`
  width: 100%;
  padding: 12px 16px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-weight: 500;
  border-radius: 12px;
  transition: 0.1s;
  ${({ color }) => getButtonColor(color)}
`;