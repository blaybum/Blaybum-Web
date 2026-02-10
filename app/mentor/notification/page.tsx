'use client';

import { useState } from 'react';
import { Row, Stack, Txt } from '@/components/common';
import { Icon } from '@/styles/common';
import { NotificationIcon, ClockIcon, CheckIcon, WarningIcon } from '@/asset/icons';
import * as Styled from '@/styles/pages/notification';

type RequestStatus = 'pending' | 'accepted' | 'rejected';
type FilterType = 'all' | RequestStatus;

interface MentoringRequest {
  id: string;
  menteeName: string;
  menteeAvatar?: string;
  subtitle: string;
  message: string;
  requestedAt: string;
  status: RequestStatus;
}

const statusLabel: Record<RequestStatus, string> = {
  pending: '대기 중',
  accepted: '수락됨',
  rejected: '거절됨',
};

const filterLabels: { key: FilterType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'pending', label: '대기 중' },
  { key: 'accepted', label: '수락됨' },
  { key: 'rejected', label: '거절됨' },
];

const mockRequests: MentoringRequest[] = [
  {
    id: '1',
    menteeName: '이서연',
    menteeAvatar: '/globe.svg',
    subtitle: '고등학교 2학년 | 수학/영어',
    message: '안녕하세요, 수학과 영어 성적을 올리고 싶어서 멘토링을 신청합니다. 특히 수학 기초가 부족해서 체계적으로 공부하고 싶습니다.',
    requestedAt: '2026-02-10 14:30',
    status: 'pending',
  },
  {
    id: '2',
    menteeName: '장민호',
    menteeAvatar: '/globe.svg',
    subtitle: '고등학교 3학년 | 국어/사회',
    message: '수능 준비를 위해 국어와 사회 멘토링을 받고 싶습니다. 현재 모의고사 성적이 3등급 정도인데 1등급을 목표로 하고 있습니다.',
    requestedAt: '2026-02-10 11:15',
    status: 'pending',
  },
  {
    id: '3',
    menteeName: '김하늘',
    menteeAvatar: '/globe.svg',
    subtitle: '중학교 3학년 | 영어/과학',
    message: '영어 회화와 과학 탐구 활동에 도움이 필요합니다.',
    requestedAt: '2026-02-09 16:45',
    status: 'accepted',
  },
  {
    id: '4',
    menteeName: '오준혁',
    menteeAvatar: '/globe.svg',
    subtitle: '고등학교 1학년 | 수학',
    message: '수학 내신 대비 멘토링을 받고 싶습니다.',
    requestedAt: '2026-02-08 09:20',
    status: 'accepted',
  },
  {
    id: '5',
    menteeName: '홍수빈',
    menteeAvatar: '/globe.svg',
    subtitle: '고등학교 2학년 | 과학',
    message: '물리와 화학 멘토링을 원합니다.',
    requestedAt: '2026-02-07 13:00',
    status: 'rejected',
  },
];

const NotificationCenter = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [requests, setRequests] = useState<MentoringRequest[]>(mockRequests);

  const filtered = filter === 'all'
    ? requests
    : requests.filter((r) => r.status === filter);

  const counts = {
    pending: requests.filter((r) => r.status === 'pending').length,
    accepted: requests.filter((r) => r.status === 'accepted').length,
    rejected: requests.filter((r) => r.status === 'rejected').length,
  };

  const handleAccept = (id: string) => {
    // TODO: API 연동
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'accepted' as RequestStatus } : r)),
    );
  };

  const handleReject = (id: string) => {
    // TODO: API 연동
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'rejected' as RequestStatus } : r)),
    );
  };

  return (
    <Styled.Container gap='lg' width='100%'>
      <Stack>
        <Txt as='p' size='subtitle'>멘토 알림 센터</Txt>
        <Txt as='p' weight='light' color='secondary'>멘토링 요청을 확인하고 관리하세요</Txt>
      </Stack>

      {/* 요약 카드 */}
      <Row gap='md' width='100%'>
        <Styled.SummaryCard>
          <Row align='center' gap='xs'>
            <div style={{ width: 16, height: 16, color: '#EA580C' }}><ClockIcon size={16} /></div>
            <Txt as='p' style={{ fontSize: 12 }} weight='light' color='secondary'>대기 중</Txt>
          </Row>
          <Txt as='p' style={{ fontSize: 24, fontWeight: 700, color: '#EA580C' }}>{counts.pending}</Txt>
        </Styled.SummaryCard>
        <Styled.SummaryCard>
          <Row align='center' gap='xs'>
            <div style={{ width: 16, height: 16, color: '#16A34A' }}><CheckIcon size={16} /></div>
            <Txt as='p' style={{ fontSize: 12 }} weight='light' color='secondary'>수락됨</Txt>
          </Row>
          <Txt as='p' style={{ fontSize: 24, fontWeight: 700, color: '#16A34A' }}>{counts.accepted}</Txt>
        </Styled.SummaryCard>
        <Styled.SummaryCard>
          <Row align='center' gap='xs'>
            <div style={{ width: 16, height: 16, color: '#DC2626' }}><WarningIcon size={16} /></div>
            <Txt as='p' style={{ fontSize: 12 }} weight='light' color='secondary'>거절됨</Txt>
          </Row>
          <Txt as='p' style={{ fontSize: 24, fontWeight: 700, color: '#DC2626' }}>{counts.rejected}</Txt>
        </Styled.SummaryCard>
      </Row>

      {/* 필터 탭 */}
      <Styled.FilterRow>
        {filterLabels.map((f) => (
          <Styled.FilterTab
            key={f.key}
            active={filter === f.key}
            onClick={() => setFilter(f.key)}
          >
            {f.label}
            {f.key !== 'all' && ` (${counts[f.key]})`}
          </Styled.FilterTab>
        ))}
      </Styled.FilterRow>

      {/* 요청 목록 */}
      <Stack gap='md' width='100%'>
        {filtered.length === 0 ? (
          <Styled.EmptyState gap='sm'>
            <Icon size='medium' color='muted'><NotificationIcon size={24} /></Icon>
            <Txt as='p' weight='light' color='secondary'>해당 상태의 요청이 없습니다</Txt>
          </Styled.EmptyState>
        ) : (
          filtered.map((req) => (
            <Styled.RequestCard key={req.id}>
              <Styled.RequestHeader>
                <Row gap='md' align='center'>
                  <Styled.RequestAvatar src={req.menteeAvatar} />
                  <Stack gap='xs'>
                    <Row align='center' gap='sm'>
                      <Txt as='p' style={{ fontSize: 18, fontWeight: 700 }}>{req.menteeName}</Txt>
                      <Styled.StatusPill tone={req.status}>
                        {statusLabel[req.status]}
                      </Styled.StatusPill>
                    </Row>
                    <Txt as='p' style={{ fontSize: 14 }} weight='light' color='secondary'>
                      {req.subtitle}
                    </Txt>
                  </Stack>
                </Row>
                <Txt as='p' style={{ fontSize: 12 }} weight='light' color='secondary'>
                  {req.requestedAt}
                </Txt>
              </Styled.RequestHeader>

              <Styled.MessageBox>{req.message}</Styled.MessageBox>

              <Styled.RequestFooter>
                <Txt as='p' style={{ fontSize: 13 }} weight='light' color='secondary'>
                  요청일: {req.requestedAt}
                </Txt>
                {req.status === 'pending' && (
                  <Row gap='sm'>
                    <Styled.RejectButton type='button' onClick={() => handleReject(req.id)}>
                      거절
                    </Styled.RejectButton>
                    <Styled.AcceptButton type='button' onClick={() => handleAccept(req.id)}>
                      수락
                    </Styled.AcceptButton>
                  </Row>
                )}
              </Styled.RequestFooter>
            </Styled.RequestCard>
          ))
        )}
      </Stack>
    </Styled.Container>
  );
};

export default NotificationCenter;
