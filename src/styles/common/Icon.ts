'use client'
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

type IconSize = 'large' | 'medium' | 'small';
type IconColor = 'primary' | 'muted';

export const Icon = styled.div<{
  size: IconSize;
  color: IconColor;
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({size}) => getIconSize(size)}
  ${({color}) => getIconColor(color)}
`;

const getIconSize = (
  size: IconSize,
) => {
  switch (size) {
    case 'large':
      return `
        width: 68px;
        height: 68px;
        border-radius: 20px;
      `;
    case 'medium':
      return `
        width: 44px;
        height: 44px;
        border-radius: 8px;
      `;
    case 'small':
      return `
        width: 20px;
        height: 20px;
        border-radius: 12px;
      `;
  }
}

const getIconColor = (
  color: IconColor,
) => {
  switch (color) {
    case 'primary':
      return `
        color: ${theme.colors.white};
        background-color: ${theme.colors.primary[500]};
      `;
    case 'muted':
      return `
        color: ${theme.colors.primary[500]};
        background-color: ${theme.colors.primary[100]};
      `;
  }
}