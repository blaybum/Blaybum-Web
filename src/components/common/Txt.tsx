'use client';
import styled from '@emotion/styled';
import type { HTMLAttributes, ReactElement } from 'react';
import { theme } from '@/styles/theme';

const TxtSizeValues = {
  title: '2.2rem',
  subtitle: '1.2rem',
  body: '1rem',
  caption: '1rem',
} as const

const TxtWeightValues = {
  light: '400',
  regular: '500',
  semibold: '600',
  bold: '700',
} as const

const TxtColorValues = {
  highlight: theme.colors.primary[500],
  primary: '#212121',
  secondary: '#757575',
} as const

type TxtSize = keyof typeof TxtSizeValues;
type TxtWeight = keyof typeof TxtWeightValues;
type TxtColor = keyof typeof TxtColorValues;
type TxtAlign = 'start' | 'end' | 'center';
type As = 'h1' | 'h2' | 'p' | 'span';

interface TxtProps extends HTMLAttributes<HTMLElement> {
  size?: TxtSize;
  weight?: TxtWeight;
  color?: TxtColor;
  align?: TxtAlign;
  as?: As;
}

export const Txt = ({
  size = 'body',
  weight = 'regular',
  color = 'primary',
  align = 'start',
  as,
  children,
  ...props
}: TxtProps): ReactElement => {
  return (
    <TxtStyled
      size={size}
      weight={weight}
      color={color}
      align={align}
      as={as}
      {...props}
    >
      {children}
    </TxtStyled>
  );
}

const TxtStyled = styled.span<{
  size: TxtSize;
  weight: TxtWeight;
  color: TxtColor;
  align: TxtAlign;
}>`
  text-align: ${({ align }) => align};
  font-size: ${({ size }) => TxtSizeValues[size]};
  font-weight: ${({ weight }) => TxtWeightValues[weight]};
  color: ${({ color }) => TxtColorValues[color]};
`;