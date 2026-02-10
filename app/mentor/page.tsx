'use client';
import { Row, Stack, Txt } from '@/components/common';
import { Icon } from '@/styles/common';
import { WarningIcon, DocumentIcon, CheckIcon, ChartIcon, ClockIcon, SproutIcon } from '@/asset/icons';
import * as Styled from '@/styles/pages/dashboard';
import { useState, useEffect } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { getMentees, type Mentee } from 'lib/api/users';

type PillTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

interface MetricBase {
  id: string;
  label: string;
  icon: ReactElement;
  iconColor: string;
  value: ReactNode;
  valueColor?: string;
}

interface MetricProgress extends MetricBase {
  kind: 'progress';
  progress: {
    current: number;
    total: number;
    color: string;
  };
}

interface MetricValueOnly extends MetricBase {
  kind: 'value';
}

type Metric = MetricProgress | MetricValueOnly;

interface SubjectBadge {
  id: string;
  label: string;
  tone: 'purple' | 'green';
}

interface StudentManageCardProps {
  avatarSrc?: string;
  name: string;
  statusPill?: {
    label: string;
    tone?: PillTone;
  };
  subtitle: string;
  recentAccess: {
    label: string;
    value: ReactNode;
  };
  metrics: Metric[];
  subjects: SubjectBadge[];
  dateText: string;
  actionLabel: string;
  onAction?: () => void;
}

const metricValueColorByTone = (tone: 'success' | 'warning' | 'info') => {
  switch (tone) {
    case 'warning':
      return '#EA580C';
    case 'info':
      return '#3B82F6';
    case 'success':
    default:
      return '#4CAF50';
  }
};

const StudentManageCard = ({
  avatarSrc,
  name,
  statusPill,
  subtitle,
  recentAccess,
  metrics,
  subjects,
  dateText,
  actionLabel,
  onAction,
}: StudentManageCardProps) => {
  return (
    <Styled.MenteeManageCard width='100%'>
      <Styled.MenteeHeader>
        <Styled.MenteeHeaderLeft gap='none'>
          <Styled.MenteeAvatar src={avatarSrc} />
          <Stack style={{ paddingLeft: 16 }} gap='xs'>
            <Styled.MenteeNameRow gap='sm'>
              <Txt as='p' style={{ fontSize: 20, lineHeight: '28px', fontWeight: 700 }}>
                {name}
              </Txt>
              {statusPill ? (
                <Styled.MenteeStatusPill tone={statusPill.tone ?? 'neutral'}>
                  {statusPill.label}
                </Styled.MenteeStatusPill>
              ) : null}
            </Styled.MenteeNameRow>
            <Txt as='p' style={{ fontSize: 14, lineHeight: '20px' }} weight='light' color='secondary'>
              {subtitle}
            </Txt>
          </Stack>
        </Styled.MenteeHeaderLeft>

        <Styled.MenteeHeaderRight>
          <Txt as='p' style={{ fontSize: 12, lineHeight: '16px' }} weight='light' color='secondary'>
            {recentAccess.label}
          </Txt>
          <Txt as='p' style={{ fontSize: 14, lineHeight: '20px', fontWeight: 600 }}>
            {recentAccess.value}
          </Txt>
        </Styled.MenteeHeaderRight>
      </Styled.MenteeHeader>

      <Styled.MetricGrid>
        {metrics.map((metric) => {
          const percent =
            metric.kind === 'progress'
              ? metric.progress.total === 0
                ? 0
                : (metric.progress.current / metric.progress.total) * 100
              : 0;

          return (
            <Styled.MetricCard key={metric.id}>
              <Styled.MetricLabelRow align='center' gap='sm' iconColor={metric.iconColor}>
                <div style={{ width: 16, height: 16, display: 'flex', color: metric.iconColor }}>
                  {metric.icon}
                </div>
                <Txt as='p' style={{ fontSize: 12, lineHeight: '16px' }} weight='light' color='secondary'>
                  {metric.label}
                </Txt>
              </Styled.MetricLabelRow>

              <Styled.MetricValue color={metric.valueColor}>{metric.value}</Styled.MetricValue>

              {metric.kind === 'progress' ? (
                <Styled.MetricProgressTrack>
                  <Styled.MetricProgressFill percent={percent} color={metric.progress.color} />
                </Styled.MetricProgressTrack>
              ) : null}
            </Styled.MetricCard>
          );
        })}
      </Styled.MetricGrid>

      <Styled.MenteeFooter>
        <Row align='center' gap='sm'>
          <Row align='center' gap='sm'>
            {subjects.map((subject) => (
              <Styled.SubjectBadge key={subject.id} tone={subject.tone}>
                {subject.label}
              </Styled.SubjectBadge>
            ))}
          </Row>
          <Txt as='p' style={{ fontSize: 12, lineHeight: '16px' }} weight='light' color='secondary'>
            {dateText}
          </Txt>
        </Row>

        <Styled.ActionButton type='button' onClick={onAction}>
          {actionLabel}
        </Styled.ActionButton>
      </Styled.MenteeFooter>
    </Styled.MenteeManageCard>
  );
};

// Mentee를 StudentManageCardProps로 변환하는 함수
const menteeToCardProps = (mentee: Mentee): StudentManageCardProps => {
  return {
    avatarSrc: mentee.profile_image || '/globe.svg',
    name: mentee.full_name || mentee.username,
    statusPill:
      mentee.status === 'ONGOING'
        ? { label: '진행중', tone: 'success' }
        : mentee.status === 'REQUEST'
        ? { label: '요청됨', tone: 'warning' }
        : { label: mentee.status, tone: 'neutral' },
    subtitle: `멘토링 상태: ${mentee.status}`,
    recentAccess: { label: '최근 접속', value: '방금 전' },
    metrics: [
      {
        id: 'today-todo',
        kind: 'progress',
        icon: <CheckIcon size={16} />,
        iconColor: '#4CAF50',
        label: '오늘 할 일',
        value: '0 / 0',
        progress: { current: 0, total: 0, color: '#4CAF50' },
      },
      {
        id: 'unread-homework',
        kind: 'value',
        icon: <DocumentIcon size={16} />,
        iconColor: '#F97316',
        label: '미확인 과제',
        value: 0,
      },
      {
        id: 'needs-feedback',
        kind: 'value',
        icon: <WarningIcon size={16} />,
        iconColor: '#4CAF50',
        label: '피드백 필요',
        value: '없음',
      },
      {
        id: 'study-time',
        kind: 'value',
        icon: <ClockIcon size={16} />,
        iconColor: '#3B82F6',
        label: '오늘 학습 시간',
        value: 0,
      },
    ],
    subjects: [
      { id: 'sub-1', label: '미지정', tone: 'purple' },
    ],
    dateText: new Date().toLocaleDateString('ko-KR'),
    actionLabel: '오늘 관리하기',
    onAction: () => {
      console.log('관리하기:', mentee.full_name);
    },
  };
};

const DashBoard = () => {
  const [mentees, setMentees] = useState<StudentManageCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setIsLoading(true);
        const users = await getMentees();
        const cardData = users.map(menteeToCardProps);
        setMentees(cardData);
      } catch (err) {
        const message = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다';
        setError(message);
        console.error('멘티 데이터 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMentees();
  }, []);

  const weeklySummary = [
    { id: 'mon', label: '월요일', percent: 90 },
    { id: 'tue', label: '화요일', percent: 85 },
    { id: 'wed', label: '수요일', percent: 78 },
    { id: 'sat', label: '토요일 (오늘)', percent: 62, highlight: true },
  ];

  const tipItems = [
    '긴급 피드백이 필요한 학생부터 우선 관리하세요',
    '과제 제출이 많은 날에는 간단한 코멘트만으로도 충분합니다',
    '학생별 학습 패턴을 파악하면 더 효율적인 관리가 가능합니다',
  ];

  if (isLoading) {
    return (
      <Styled.Container gap='md' width='100%'>
        <Txt as='p' size='subtitle'>로딩 중...</Txt>
      </Styled.Container>
    );
  }

  if (error) {
    return (
      <Styled.Container gap='md' width='100%'>
        <Txt as='p' size='subtitle' style={{ color: 'red' }}>{error}</Txt>
      </Styled.Container>
    );
  }

  return (
    <Styled.Container gap='md' width='100%'>
      <Stack>
        <Txt as='p' size='subtitle'> 오늘 관리해야 할 학생 </Txt>
        <Txt as='p' weight='light' color='secondary'> 총 {mentees.length}명의 학생이 관리 대기 중입니다 </Txt>
      </Stack>
      
      <Row gap='md' width='100%'>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <WarningIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> {mentees.length} </Txt>
            <Txt as='p' weight='light' color='secondary'> 전체 학생 </Txt>
          </Stack>
        </Styled.Card>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <DocumentIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 0 </Txt>
            <Txt as='p' weight='light' color='secondary'> 피드백 미작성 </Txt>
          </Stack>
        </Styled.Card>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <CheckIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 0 </Txt>
            <Txt as='p' weight='light' color='secondary'> 완료된 과제 </Txt>
          </Stack>
        </Styled.Card>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <ChartIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 0 </Txt>
            <Txt as='p' weight='light' color='secondary'> 진행중인 과제 </Txt>
          </Stack>
        </Styled.Card>
      </Row>

      <Stack gap='md' width='100%'>
        {mentees.map((card) => (
          <StudentManageCard key={card.name} {...card} />
        ))}
      </Stack>

      <Styled.BottomSection>
        <Styled.WeeklyCard>
          <Styled.BottomCardTitleRow gap='sm'>
            <div style={{ width: 18, height: 18, color: '#4CAF50' }}>
              <SproutIcon size={18} />
            </div>
            <Txt as='p' style={{ fontSize: 18, lineHeight: '28px', fontWeight: 700 }}>
              이번 주 관리 현황
            </Txt>
          </Styled.BottomCardTitleRow>
          <Styled.WeeklyRows>
            {weeklySummary.map((item) => (
              <Styled.WeeklyRow key={item.id}>
                <Txt
                  as='p'
                  style={{ fontSize: 14, lineHeight: '20px', fontWeight: item.highlight ? 600 : 400 }}
                  color={item.highlight ? 'highlight' : 'secondary'}
                >
                  {item.label}
                </Txt>
                <Styled.WeeklyBarGroup gap='sm' align='center'>
                  <Styled.WeeklyBarTrack>
                    <Styled.WeeklyBarFill percent={item.percent} />
                  </Styled.WeeklyBarTrack>
                  <Txt
                    as='p'
                    style={{
                      fontSize: 14,
                      lineHeight: '20px',
                      fontWeight: 600,
                      fontFamily: 'Nimbus Sans, system-ui, -apple-system, sans-serif',
                    }}
                    color={item.highlight ? 'highlight' : 'primary'}
                  >
                    {item.percent}%
                  </Txt>
                </Styled.WeeklyBarGroup>
              </Styled.WeeklyRow>
            ))}
          </Styled.WeeklyRows>
        </Styled.WeeklyCard>

        <Styled.TipCard>
          <Styled.BottomCardTitleRow gap='sm'>
            <div style={{ width: 18, height: 18, color: '#EAB308' }}>
              <SproutIcon size={18} />
            </div>
            <Txt as='p' style={{ fontSize: 18, lineHeight: '28px', fontWeight: 700 }}>
              오늘의 관리 팁
            </Txt>
          </Styled.BottomCardTitleRow>
          <Styled.TipRows>
            {tipItems.map((tip) => (
              <Styled.TipRow key={tip} gap='sm'>
                <Styled.TipCheckCircle>✓</Styled.TipCheckCircle>
                <Txt as='p' style={{ fontSize: 14, lineHeight: '20px' }}>
                  {tip}
                </Txt>
              </Styled.TipRow>
            ))}
          </Styled.TipRows>
        </Styled.TipCard>
      </Styled.BottomSection>
    </Styled.Container>
  );
};

export default DashBoard;