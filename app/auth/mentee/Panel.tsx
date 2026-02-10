'use client'
import * as Auth from "@/styles/pages/auth";
import { Row, Stack, Txt } from "@/components/common";
import { Icon } from "@/styles/common";
import { SproutIcon, ClipBoardIcon, ChatIcon, ChartIcon, InfoIcon, CheckIcon, ClockIcon } from "@/asset/icons";
import { ReactElement } from 'react';

const Card = ({ icon, title, body }: {
  icon: ReactElement,
  title: string,
  body: string,
}) => {
  return (
    <Auth.Card gap='lg'>
      <Icon size='medium' color='muted'> {icon} </Icon>
      <Stack gap='xs'>
        <Txt as='p' size='subtitle'> {title} </Txt>
        <Txt as='p' weight='light' color='secondary'> {body} </Txt>
      </Stack>
    </Auth.Card>
  );
}

const MenteePanel = () => {
  return (
    <Auth.Panel gap='xxxl' justify='center'>
      <Row align='center' gap='lg'>
        <Icon size='large' color='primary'> <SproutIcon size={36} /> </Icon>
        <Stack>
          <Txt as='h1' size='title' weight='semibold'> 설스터디 </Txt>
          <Txt as='p' weight='light' color='secondary'> 멘티 학습 관리 시스템 </Txt>
        </Stack>
      </Row>
      <Stack gap='md' width='100%'>
        <Card
          icon={ <ClipBoardIcon size={24} /> }
          title="체계적인 학습 관리"
          body="개인 맞춤 학습 계획을 수립하고 체계적으로 공부하세요"
        />
        <Card
          icon={ <ChatIcon size={24} /> }
          title="실시간 피드백 받기"
          body="멘토로부터 즉시 피드백을 받아 학습 방향을 명확히 하세요"
        />
        <Card
          icon={ <CheckIcon size={24} /> }
          title="성장 목표 달성"
          body="목표를 설정하고 달성 과정을 추적하며 성취감을 느끼세요"
        />
      </Stack>
      <Row gap='xxl'>
        <Row align='center' gap='sm'>
          <CheckIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 안전한 로그인 </Txt>
        </Row>
        <Row align='center' gap='sm'>
          <ClockIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 24시간 접근 가능 </Txt>
        </Row>
        <Row align='center' gap='sm'>
          <InfoIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 학습 지원 </Txt>
        </Row>
      </Row>
    </Auth.Panel>
  );
}

export default MenteePanel;