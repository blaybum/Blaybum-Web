'use client';
import { Row, Stack, Txt } from '@/components/common';
import { Icon, Line } from '@/styles/common';
import { SproutIcon } from '@/asset/icons';
import * as Styled from '@/styles/layout/footer';

const Footer = () => {
  return (
    <Styled.Container align='center' gap='xl'>
      <Styled.Header>
        <Styled.HeaderLeft align='center' gap='sm'>
          <Icon size='small' color='primary'> <SproutIcon size={16} /> </Icon>
          <Txt as='p'> 설스터디 </Txt>
        </Styled.HeaderLeft>
        <Styled.HeaderCenter gap='lg'>
          <Txt as='p' weight='light' color='secondary'> 이용약관 </Txt>
          <Txt as='p' weight='light' color='secondary'> 개인정보처리방침 </Txt>
          <Txt as='p' weight='light' color='secondary'> 고객지원 </Txt>
          <Txt as='p' weight='light' color='secondary'> 공지사항 </Txt>
        </Styled.HeaderCenter>
        <Styled.HeaderRight as='p' weight='light' color='secondary'> © 2024 설스터디. All rights reserved. </Styled.HeaderRight>
      </Styled.Header>
      <Row width='100%'> <Line /> </Row>
      <Txt as='p' weight='light' color='secondary' align='center'>
        설스터디는 학생과 멘토가 함께 성장하는 학습 관리 플랫폼입니다 <br />
        문의: support@seolstudy.com | 대표전화: 02-1234-5678
      </Txt>
    </Styled.Container>
  );
}

export default Footer;