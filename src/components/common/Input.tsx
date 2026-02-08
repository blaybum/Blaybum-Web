'use client';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';
import type { InputHTMLAttributes, ReactElement } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement;
  type?: string;
  placeholder: string;
}

export const Input = ({
  icon,
  type = 'text',
  placeholder,
  ...props
}: InputProps): ReactElement => {
  return (
    <Wrapper>
      {icon && <Icon> {icon} </Icon>}
      <InputStyled
        type={type}
        placeholder={placeholder}
        {...props}
      />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  position: relative;
  color: ${theme.colors.natural[700]};
`;

const Icon = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 14px;
  left: 14px;
`;

const InputStyled = styled.input`
  width: 100%;
  padding: 12px;
  padding-left: 44px;
  border: none;
  border-radius: 12px;
  background-color: ${theme.colors.bg['secondary']};
`;