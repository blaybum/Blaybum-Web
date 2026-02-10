'use client';
import { useState, useEffect } from 'react'
import { Row, Txt } from '@/components/common';
import { Button } from '@/styles/common';
import { CalendarIcon, FilterIcon, ReloadIcon } from '@/asset/icons';
import * as Styled from '@/styles/layout/header';

const Header = () => {
  const [currentDate, setCurrentDate] = useState('');

  // 현재 날짜
  useEffect(() => {
    const now = new Date()
    setCurrentDate(now.toLocaleDateString('ko-KR'))
  }, [])

  return (
    <Styled.Container align='center' justify='space-between'>
      <Row align='center' gap='sm'>
        <CalendarIcon size={20} />
        <Txt as='p' weight='light'> {currentDate} </Txt>
      </Row>
      <Row gap='sm'>
        <Button size='sm' color='muted'>
          <FilterIcon size={16} />
          필터
        </Button>
        <Button size='sm' color='primary'>
          <ReloadIcon size={16} />
          새로고침
        </Button>
      </Row>
    </Styled.Container>
  );
}

export default Header;