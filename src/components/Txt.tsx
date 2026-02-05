'use client'
import styled from '@emotion/styled';
import type { HTMLAttributes, ReactElement } from 'react';

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
  primary: '#212121',
  secondary: '#757575',
} as const

type TxtSize = keyof typeof TxtSizeValues;
type TxtWeight = keyof typeof TxtWeightValues;
type TxtColor = keyof typeof TxtColorValues;
type As = 'h1' | 'h2' | 'p' | 'span';

interface TxtProps extends HTMLAttributes<HTMLElement> {
  size?: TxtSize;
  weight?: TxtWeight;
  color?: TxtColor;
  as?: As;
}

export const Txt = ({
  size = 'body',
  weight = 'regular',
  color = 'primary',
  as,
  children,
  ...props
}: TxtProps): ReactElement => {
  return (
    <TxtStyled
      size={size}
      weight={weight}
      color={color}
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
}>`
  font-size: ${({size}) => TxtSizeValues[size]};
  font-weight: ${({weight}) => TxtWeightValues[weight]};
  color: ${({color}) => TxtColorValues[color]};
`;