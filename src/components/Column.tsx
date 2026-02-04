'use client'
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { HTMLAttributes, ReactElement } from 'react';

type Align = 'flex-start' | 'center' | 'flex-end';
type Justify = 'flex-start' | 'center' | 'flex-end' | 'space-between';
type Gap = keyof typeof theme.spacing;

interface RowProps extends HTMLAttributes<HTMLElement> {
  align?: Align,
  justify?: Justify,
  gap?: Gap,
}

export const Column = ({
  align = 'flex-start',
  justify = 'flex-start',
  gap = 'xs',
  children,
  ...props
}: RowProps): ReactElement => {
  return (
    <RowStyled
      align={align}
      justify={justify}
      gap={gap}
      {...props}
    >
      {children}
    </RowStyled>
  );
}

const RowStyled = styled.div<{
  gap: Gap,
  align: Align,
  justify: Justify,
}>`
  display: flex;
  flex-direction: column;
  align-items: ${({align}) => align};
  justify-content: ${({justify}) => justify};
  gap: ${({gap}) => theme.spacing[gap]}
`;