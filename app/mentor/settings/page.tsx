'use client';

import { useState } from 'react';
import { Row, Stack, Txt } from '@/components/common';
import { Icon } from '@/styles/common';
import { UserIcon, NotificationIcon, SettingIcon, PeopleIcon, CalendarIcon, ChatIcon } from '@/asset/icons';
import * as Styled from '@/styles/pages/settings';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const UserProfile = () => {
  const [name, setName] = useState('김멘토');
  const [email, setEmail] = useState('mentor@example.com');
  const [menteeCount] = useState(12);
  const [activityDays] = useState(45);
  const [monthlyFeedback] = useState(32);

  const [notifications, setNotifications] = useState<NotificationSetting[]>([
    {
      id: 'email',
      label: '이메일 알림',
      description: '새로운 멘토링 요청 및 과제 제출 시 이메일 알림을 받습니다',
      enabled: true,
    },
    {
      id: 'push',
      label: '푸시 알림',
      description: '브라우저 푸시 알림을 통해 실시간 알림을 받습니다',
      enabled: false,
    },
    {
      id: 'mentoring-request',
      label: '멘토링 요청 알림',
      description: '새로운 멘티의 멘토링 요청이 들어오면 알림을 받습니다',
      enabled: true,
    },
    {
      id: 'feedback-reminder',
      label: '피드백 리마인더',
      description: '미작성 피드백이 있을 때 리마인더 알림을 받습니다',
      enabled: true,
    },
  ]);

  const handleToggle = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n)),
    );
  };

  const handleSave = () => {
    // TODO: API 연동 - api.auth.patchMe({ username: name, ... })
  };

  return (
    <Styled.Container gap='lg' width='100%'>
      <Stack>
        <Txt as='p' size='subtitle'>멘토 설정</Txt>
        <Txt as='p' weight='light' color='secondary'>프로필 정보와 알림 설정을 관리하세요</Txt>
      </Stack>

      {/* 프로필 섹션 */}
      <Styled.SectionCard>
        <Styled.SectionHeader gap='sm'>
          <Icon size='small' color='muted'><UserIcon size={16} /></Icon>
          <Txt as='p' style={{ fontSize: 18, fontWeight: 700 }}>프로필 정보</Txt>
        </Styled.SectionHeader>

        <Row gap='xl' width='100%' align='center'>
          <Styled.AvatarWrapper>
            <Styled.ProfileAvatar src='/globe.svg' />
            <Styled.AvatarEditButton type='button'>+</Styled.AvatarEditButton>
          </Styled.AvatarWrapper>

          <Stack gap='lg' width='100%'>
            <Styled.FormRow>
              <Styled.FormLabel>이름</Styled.FormLabel>
              <Styled.FormInput
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder='이름을 입력하세요'
              />
            </Styled.FormRow>
            <Styled.FormRow>
              <Styled.FormLabel>이메일</Styled.FormLabel>
              <Styled.FormInput
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder='이메일을 입력하세요'
                type='email'
              />
            </Styled.FormRow>
          </Stack>
        </Row>

        <Row gap='md' width='100%'>
          <Styled.StatCard>
            <Row align='center' gap='xs'>
              <div style={{ width: 16, height: 16, color: '#4CAF50' }}><PeopleIcon size={16} /></div>
              <Txt as='p' style={{ fontSize: 12 }} weight='light' color='secondary'>담당 멘티</Txt>
            </Row>
            <Txt as='p' style={{ fontSize: 20, fontWeight: 700 }}>{menteeCount}명</Txt>
          </Styled.StatCard>
          <Styled.StatCard>
            <Row align='center' gap='xs'>
              <div style={{ width: 16, height: 16, color: '#3B82F6' }}><CalendarIcon size={16} /></div>
              <Txt as='p' style={{ fontSize: 12 }} weight='light' color='secondary'>활동 일수</Txt>
            </Row>
            <Txt as='p' style={{ fontSize: 20, fontWeight: 700 }}>{activityDays}일</Txt>
          </Styled.StatCard>
          <Styled.StatCard>
            <Row align='center' gap='xs'>
              <div style={{ width: 16, height: 16, color: '#F97316' }}><ChatIcon size={16} /></div>
              <Txt as='p' style={{ fontSize: 12 }} weight='light' color='secondary'>월별 피드백</Txt>
            </Row>
            <Txt as='p' style={{ fontSize: 20, fontWeight: 700 }}>{monthlyFeedback}건</Txt>
          </Styled.StatCard>
        </Row>
      </Styled.SectionCard>

      {/* 알림 설정 섹션 */}
      <Styled.SectionCard>
        <Styled.SectionHeader gap='sm'>
          <Icon size='small' color='muted'><NotificationIcon size={16} /></Icon>
          <Txt as='p' style={{ fontSize: 18, fontWeight: 700 }}>알림 설정</Txt>
        </Styled.SectionHeader>

        <Stack width='100%'>
          {notifications.map((setting) => (
            <Styled.ToggleRow key={setting.id}>
              <Stack gap='xs'>
                <Txt as='p' style={{ fontSize: 14, fontWeight: 600 }}>{setting.label}</Txt>
                <Txt as='p' style={{ fontSize: 13 }} weight='light' color='secondary'>
                  {setting.description}
                </Txt>
              </Stack>
              <Styled.Toggle
                type='button'
                checked={setting.enabled}
                onClick={() => handleToggle(setting.id)}
              />
            </Styled.ToggleRow>
          ))}
        </Stack>
      </Styled.SectionCard>

      <Row justify='flex-end' width='100%'>
        <Styled.SaveButton type='button' onClick={handleSave}>
          변경사항 저장
        </Styled.SaveButton>
      </Row>
    </Styled.Container>
  );
};

export default UserProfile;
