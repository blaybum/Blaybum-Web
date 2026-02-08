'use client';
import { useState } from 'react';
import { Row, Stack, Txt } from '@/components/common';
import { Icon } from '@/styles/common';
import { SproutIcon, CalendarIcon, PeopleIcon, AddOneIcon, NotificationIcon, SettingIcon, KebabMenuIcon } from '@/asset/icons';
import * as Styled from '@/styles/layout/sidebar';
import type { HTMLAttributes, ReactElement } from 'react';
import styled from '@emotion/styled';
import { theme } from '@/styles/theme';

type Select = 'on' | 'off';
type Menu = 'today' | 'mentee' | 'todo' | 'notification' | 'setting';

interface User {
  name: string;
  people: number;
  profile: string;
}

interface ItemProps extends HTMLAttributes<HTMLElement> {
  icon: ReactElement;
  content: string;
  select: Select;
}

const user: User = {
  name: '김멘토',
  people: 12,
  profile: '/globe.svg',
}

const Item = ({
  icon,
  content,
  select,
  ...props
}: ItemProps): ReactElement => {
  const getSelect = (
    select: Select,
  ) => {
    switch (select) {
      case 'on':
        return `
          color: ${theme.colors.primary[500]};
          background-color: ${theme.colors.primary[100]};

          &:hover {
            background-color: ${theme.colors.primary[200]};
          }
        `;
      case 'off':
        return `
          color: ${theme.colors.natural[700]};
          background-color: ${theme.colors.bg['primary']};

          &:hover {
            background-color: ${theme.colors.bg['secondary']};
          }
        `;
    }
  }

  const ItemStyled = styled(Row)<{
    select: Select;
  }>`
    padding: 8px 12px;
    border-radius: 8px;
    cursor: pointer;
    ${({ select }) => getSelect(select)};
  `;

  return (
    <ItemStyled select={select} align='center' gap='sm' width='100%' {...props}>
      {icon}
      {content}
    </ItemStyled>
  );
}

const Sidebar = ({ select }: {
  select: Menu;
}) => {
  const [selected, setSelected] = useState<Menu>(select);

  return (
    <Styled.Container justify='space-between'>
      <Stack gap='xl' width='100%'>
        <Row align='center' gap='md'>
          <Icon size='medium' color='primary'> <SproutIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 설스터디 </Txt>
            <Txt as='p' weight='light' color='secondary'> 멘토 시스템 </Txt>
          </Stack>
        </Row>
        <Stack gap='xs' width='100%'>
          <Item
            icon={ <CalendarIcon size={20} /> }
            content='오늘 관리'
            select={selected === 'today' ? 'on' : 'off'}
          />
          <Item
            icon={ <PeopleIcon size={20} /> }
            content='멘티 목록'
            select={selected === 'mentee' ? 'on' : 'off'}
          />
          <Item
            icon={ <AddOneIcon size={20} /> }
            content='할 일 등록'
            select={selected === 'todo' ? 'on' : 'off'}
          />
          <Item
            icon={ <NotificationIcon size={20} /> }
            content='멘토 알림 센터'
            select={selected === 'notification' ? 'on' : 'off'}
          />
          <Item
            icon={ <SettingIcon size={20} /> }
            content='멘토 설정/프로필'
            select={selected === 'setting' ? 'on' : 'off'}
          />
        </Stack>
      </Stack>
      <Row align='center' justify='space-between' width='100%'>
        <Row align='center' gap='md'>
          <Styled.Profile> <img src={user.profile} /> </Styled.Profile>
          <Stack>
            <Txt as='p'> {user.name} </Txt>
            <Txt as='p' weight='light' color='secondary'> 담당 학생 {user.people}명 </Txt>
          </Stack>
        </Row>
        <KebabMenuIcon size={16} />
      </Row>
    </Styled.Container>
  );
}

export default Sidebar;