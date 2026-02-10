'use client'
import * as Auth from "@/styles/pages/auth";
import { Row, Stack, Txt } from "@/components/common";
import { Icon } from "@/styles/common";
import { SproutIcon, ChartIcon, ClipBoardIcon, ChatIcon, ShieldIcon, ClockIcon, HeadsetIcon } from "@/asset/icons";
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

const MentorPanel = () => {
  return (
    <Auth.Panel gap='xxxl' justify='center'>
      <Row align='center' gap='lg'>
        <Icon size='large' color='primary'> <SproutIcon size={36} /> </Icon>
        <Stack>
          <Txt as='h1' size='title' weight='semibold'> 설스터디 </Txt>
          <Txt as='p' weight='light' color='secondary'> 멘토 관리 시스템 </Txt>
        </Stack>
      </Row>
      <Stack gap='md' width='100%'>
        <Card
          icon={ <ChartIcon size={24} /> }
          title="효율적인 학생 관리"
          body="한 화면에서 오늘 관리할 학생을 파악하고, 빠르게 피드백을 작성하세요"
        />
        <Card
          icon={ <ClipBoardIcon size={24} /> }
          title="체계적인 할 일 관리"
          body="학생별 학습 과제를 등록하고, 진행 상황을 실시간으로 확인하세요"
        />
        <Card
          icon={ <ChatIcon size={24} /> }
          title="즉시 전달되는 피드백"
          body="작성한 피드백이 학생에게 바로 전달되어 학습 방향을 제시합니다"
        />
      </Stack>
      <Row gap='xxl'>
        <Row align='center' gap='sm'>
          <ShieldIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 안전한 로그인 </Txt>
        </Row>
        <Row align='center' gap='sm'>
          <ClockIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 24시간 접근 가능 </Txt>
        </Row>
        <Row align='center' gap='sm'>
          <HeadsetIcon size={16} />
          <Txt as='p' weight='light' color='secondary'> 실시간 지원 </Txt>
        </Row>
      </Row>
    </Auth.Panel>
  );
}

export default MentorPanel;