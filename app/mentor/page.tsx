'use client';
import { Row, Stack, Txt } from '@/components/common';
import { Icon } from '@/styles/common';
import { WarningIcon, DocumentIcon, CheckIcon, ChartIcon, ClockIcon, SproutIcon } from '@/asset/icons';
import * as Styled from '@/styles/pages/mentor';
import type { ReactElement, ReactNode } from 'react';

type PillTone = 'danger' | 'warning' | 'success' | 'info' | 'neutral';

type MetricTone = 'success' | 'warning' | 'info';

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

const metricValueColorByTone = (tone: MetricTone) => {
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

const DashBoard = () => {
  const menteeCardDataList: StudentManageCardProps[] = [
    {
      avatarSrc: '/globe.svg',
      name: '박서현',
      statusPill: { label: '긴급', tone: 'danger' },
      subtitle: '고등학교 2학년 | 수학/영어 집중',
      recentAccess: { label: '최근 접속', value: '2시간 전' },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '3 / 5',
          progress: { current: 3, total: 5, color: '#4CAF50' },
        },
        {
          id: 'unread-homework',
          kind: 'value',
          icon: <DocumentIcon size={16} />,
          iconColor: '#F97316',
          label: '미확인 과제',
          value: 4,
          valueColor: metricValueColorByTone('warning'),
        },
        {
          id: 'needs-feedback',
          kind: 'value',
          icon: <WarningIcon size={16} />,
          iconColor: '#ef4444',
          label: '피드백 필요',
          value: 2,
          valueColor: '#ef4444',
        },
        {
          id: 'study-time',
          kind: 'value',
          icon: <ClockIcon size={16} />,
          iconColor: '#3B82F6',
          label: '오늘 학습 시간',
          value: (
            <span style={{ display: 'inline-flex', gap: 8 }}>
              <span>2</span>
              <span>15</span>
            </span>
          ),
        },
      ],
      subjects: [
        { id: 'sub-1', label: '수학', tone: 'purple' },
        { id: 'sub-2', label: '영어', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
    {
      avatarSrc: '/globe.svg',
      name: '김도윤',
      statusPill: { label: '확인 필요', tone: 'warning' },
      subtitle: '고등학교 3학년 | 국어/사회 집중',
      recentAccess: { label: '최근 접속', value: 30 },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '4 / 4',
          progress: { current: 4, total: 4, color: '#4CAF50' },
        },
        {
          id: 'unread-homework',
          kind: 'value',
          icon: <DocumentIcon size={16} />,
          iconColor: '#F97316',
          label: '미확인 과제',
          value: 3,
          valueColor: metricValueColorByTone('warning'),
        },
        {
          id: 'needs-feedback',
          kind: 'value',
          icon: <WarningIcon size={16} />,
          iconColor: '#4CAF50',
          label: '피드백 필요',
          value: '오늘',
          valueColor: metricValueColorByTone('success'),
        },
        {
          id: 'study-time',
          kind: 'value',
          icon: <ClockIcon size={16} />,
          iconColor: '#3B82F6',
          label: '오늘 학습 시간',
          value: (
            <span style={{ display: 'inline-flex', gap: 8 }}>
              <span>3</span>
              <span>40</span>
            </span>
          ),
        },
      ],
      subjects: [
        { id: 'sub-1', label: '국어', tone: 'purple' },
        { id: 'sub-2', label: '사회', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
    {
      avatarSrc: '/globe.svg',
      name: '이하은',
      statusPill: { label: '피드백 필요', tone: 'info' },
      subtitle: '중학교 3학년 | 영어/수학 집중',
      recentAccess: { label: '최근 접속', value: '1시간 전' },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '2 / 6',
          progress: { current: 2, total: 6, color: '#F59E0B' },
        },
        {
          id: 'unread-homework',
          kind: 'value',
          icon: <DocumentIcon size={16} />,
          iconColor: '#F97316',
          label: '미확인 과제',
          value: 1,
          valueColor: metricValueColorByTone('warning'),
        },
        {
          id: 'needs-feedback',
          kind: 'value',
          icon: <WarningIcon size={16} />,
          iconColor: '#4CAF50',
          label: '피드백 필요',
          value: '오늘',
          valueColor: metricValueColorByTone('success'),
        },
        {
          id: 'study-time',
          kind: 'value',
          icon: <ClockIcon size={16} />,
          iconColor: '#3B82F6',
          label: '오늘 학습 시간',
          value: (
            <span style={{ display: 'inline-flex', gap: 8 }}>
              <span>1</span>
              <span>30</span>
            </span>
          ),
        },
      ],
      subjects: [
        { id: 'sub-1', label: '영어', tone: 'purple' },
        { id: 'sub-2', label: '수학', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
    {
      avatarSrc: '/globe.svg',
      name: '최민준',
      statusPill: { label: '안정', tone: 'success' },
      subtitle: '고등학교 2학년 | 수학/과학 집중',
      recentAccess: { label: '최근 접속', value: '5분 전' },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '5 / 5',
          progress: { current: 5, total: 5, color: '#4CAF50' },
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
          value: '오늘',
          valueColor: metricValueColorByTone('success'),
        },
        {
          id: 'study-time',
          kind: 'value',
          icon: <ClockIcon size={16} />,
          iconColor: '#3B82F6',
          label: '오늘 학습 시간',
          value: (
            <span style={{ display: 'inline-flex', gap: 8 }}>
              <span>4</span>
              <span>20</span>
            </span>
          ),
        },
      ],
      subjects: [
        { id: 'sub-1', label: '수학', tone: 'purple' },
        { id: 'sub-2', label: '과학', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
    {
      avatarSrc: '/globe.svg',
      name: '정수아',
      statusPill: { label: '피드백 필요', tone: 'info' },
      subtitle: '고등학교 2학년 | 영어/사회 집중',
      recentAccess: { label: '최근 접속', value: '3시간 전' },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '3 / 4',
          progress: { current: 3, total: 4, color: '#4CAF50' },
        },
        {
          id: 'unread-homework',
          kind: 'value',
          icon: <DocumentIcon size={16} />,
          iconColor: '#F97316',
          label: '미확인 과제',
          value: 1,
          valueColor: metricValueColorByTone('warning'),
        },
        {
          id: 'needs-feedback',
          kind: 'value',
          icon: <WarningIcon size={16} />,
          iconColor: '#4CAF50',
          label: '피드백 필요',
          value: '오늘',
          valueColor: metricValueColorByTone('success'),
        },
        {
          id: 'study-time',
          kind: 'value',
          icon: <ClockIcon size={16} />,
          iconColor: '#3B82F6',
          label: '오늘 학습 시간',
          value: (
            <span style={{ display: 'inline-flex', gap: 8 }}>
              <span>2</span>
              <span>50</span>
            </span>
          ),
        },
      ],
      subjects: [
        { id: 'sub-1', label: '영어', tone: 'purple' },
        { id: 'sub-2', label: '사회', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
    {
      avatarSrc: '/globe.svg',
      name: '김지훈',
      statusPill: { label: '확인 필요', tone: 'warning' },
      subtitle: '고등학교 1학년 | 국어/수학 집중',
      recentAccess: { label: '최근 접속', value: '5시간 전' },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '1 / 3',
          progress: { current: 1, total: 3, color: '#F59E0B' },
        },
        {
          id: 'unread-homework',
          kind: 'value',
          icon: <DocumentIcon size={16} />,
          iconColor: '#F97316',
          label: '미확인 과제',
          value: 1,
          valueColor: metricValueColorByTone('warning'),
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
          value: 45,
        },
      ],
      subjects: [
        { id: 'sub-1', label: '국어', tone: 'purple' },
        { id: 'sub-2', label: '수학', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
    {
      avatarSrc: '/globe.svg',
      name: '윤서진',
      statusPill: { label: '피드백 필요', tone: 'info' },
      subtitle: '고등학교 2학년 | 과학/수학 집중',
      recentAccess: { label: '최근 접속', value: 10 },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '4 / 6',
          progress: { current: 4, total: 6, color: '#4CAF50' },
        },
        {
          id: 'unread-homework',
          kind: 'value',
          icon: <DocumentIcon size={16} />,
          iconColor: '#F97316',
          label: '미확인 과제',
          value: 1,
          valueColor: metricValueColorByTone('warning'),
        },
        {
          id: 'needs-feedback',
          kind: 'value',
          icon: <WarningIcon size={16} />,
          iconColor: '#4CAF50',
          label: '피드백 필요',
          value: '오늘',
          valueColor: metricValueColorByTone('success'),
        },
        {
          id: 'study-time',
          kind: 'value',
          icon: <ClockIcon size={16} />,
          iconColor: '#3B82F6',
          label: '오늘 학습 시간',
          value: (
            <span style={{ display: 'inline-flex', gap: 8 }}>
              <span>3</span>
              <span>10</span>
            </span>
          ),
        },
      ],
      subjects: [
        { id: 'sub-1', label: '과학', tone: 'purple' },
        { id: 'sub-2', label: '수학', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
    {
      avatarSrc: '/globe.svg',
      name: '한태영',
      statusPill: { label: '확인 필요', tone: 'warning' },
      subtitle: '고등학교 3학년 | 수능/내신 집중',
      recentAccess: { label: '최근 접속', value: '6시간 전' },
      metrics: [
        {
          id: 'today-todo',
          kind: 'progress',
          icon: <CheckIcon size={16} />,
          iconColor: '#4CAF50',
          label: '오늘 할 일',
          value: '2 / 4',
          progress: { current: 2, total: 4, color: '#F59E0B' },
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
          value: 55,
        },
      ],
      subjects: [
        { id: 'sub-1', label: '국어', tone: 'purple' },
        { id: 'sub-2', label: '수학', tone: 'green' },
      ],
      dateText: '2024.02.02',
      actionLabel: '오늘 관리하기',
      onAction: () => {},
    },
  ];

  const weeklySummary: {
    id: string;
    label: string;
    percent: number;
    highlight?: boolean;
  }[] = [
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

  return (
    <Styled.Container gap='md' width='100%'>
      <Stack>
        <Txt as='p' size='subtitle'> 오늘 관리해야 할 학생 </Txt>
        <Txt as='p' weight='light' color='secondary'> 총 8명의 학생이 관리 대기 중입니다 </Txt>
      </Stack>
      <Row gap='md' width='100%'>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <WarningIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 5 </Txt>
            <Txt as='p' weight='light' color='secondary'> 피드백 미작성 </Txt>
          </Stack>
        </Styled.Card>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <DocumentIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 5 </Txt>
            <Txt as='p' weight='light' color='secondary'> 피드백 미작성 </Txt>
          </Stack>
        </Styled.Card>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <CheckIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 5 </Txt>
            <Txt as='p' weight='light' color='secondary'> 피드백 미작성 </Txt>
          </Stack>
        </Styled.Card>
        <Styled.Card gap='lg'>
          <Icon size='medium' color='muted'> <ChartIcon size={24} /> </Icon>
          <Stack>
            <Txt as='p' size='subtitle'> 5 </Txt>
            <Txt as='p' weight='light' color='secondary'> 피드백 미작성 </Txt>
          </Stack>
        </Styled.Card>
      </Row>
      <Stack gap='md' width='100%'>
        {menteeCardDataList.map((card, index) => (
          <StudentManageCard key={`${card.name}-${index}`} {...card} />
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
                      fontWeight: item.highlight ? 600 : 600,
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
                <Styled.TipCheckCircle>
                  ✓
                </Styled.TipCheckCircle>
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
}

export default DashBoard;