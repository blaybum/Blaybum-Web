'use client';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { HTMLAttributes, ReactElement } from 'react';

type Align = 'flex-start' | 'center' | 'flex-end';
type Justify = 'flex-start' | 'center' | 'flex-end' | 'space-between';
type Gap = keyof typeof theme.spacing;
type Width = string;

interface RowProps extends HTMLAttributes<HTMLElement> {
  align?: Align,
  justify?: Justify,
  gap?: Gap,
  width?: Width;
}

export const Stack = ({
  align = 'flex-start',
  justify = 'flex-start',
  gap = 'none',
  width = 'auto',
  children,
  ...props
}: RowProps): ReactElement => {
  return (
    <RowStyled
      align={align}
      justify={justify}
      gap={gap}
      width={width}
      {...props}
    >
      {children}
    </RowStyled>
  );
}

const RowStyled = styled.div<{
  gap: Gap;
  align: Align;
  justify: Justify;
  width: Width;
}>`
  width: ${({ width }) => width};
  display: flex;
  flex-direction: column;
  align-items: ${({ align }) => align};
  justify-content: ${({ justify }) => justify};
  gap: ${({ gap }) => theme.spacing[gap]};
`;