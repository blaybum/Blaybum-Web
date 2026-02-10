'use client';
import styled from '@emotion/styled';
import { Row, Stack } from '@/components/common';
import { theme } from '@/styles/theme';

export const Container = styled(Stack)`
  padding: 28px;
  background-color: ${theme.colors.natural[100]};
  min-height: 100%;  // ← overflow: scroll 제거, min-height로 변경
  width: 100%;
`;

export const CardRow = styled(Row)`
  padding: 16px;
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;
  background-color: ${theme.colors.bg['primary']};
`;

export const Card = styled(Stack)`
  width: 100%;
  padding: 20px;
  color: ${theme.colors.natural[200]};
  border: 1px solid ${theme.colors.primary[100]};
  border-radius: 16px;
  background-color: ${theme.colors.bg['primary']};
`;

export const Profile = styled.div`
  width: 24px;
  height: 24px;
`;

export const Mentee = styled(Stack)`
  padding: 20px;
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;
  background-color: ${theme.colors.bg['primary']};
`; 

export const Status = styled(Stack)`
  padding: 12px;
  border-radius: 8px;
  background-color: ${theme.colors.natural[100]};
`;

// Figma(53-6208) mentee manage card
export const MenteeManageCard = styled(Stack)`
  box-sizing: border-box;
  width: 100%;
  padding: 24px;
  gap: 16px;

  background: ${theme.colors.bg.primary};
  border: 1px solid ${theme.colors.natural[200]};
  border-radius: 12px;
`;

export const MenteeHeader = styled(Row)`
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
`;

export const MenteeHeaderLeft = styled(Row)`
  align-items: center;
`;

export const MenteeAvatar = styled.div<{
  src?: string;
}>`
  width: 56px;
  height: 56px;
  border-radius: 9999px;
  border: 2px solid ${theme.colors.natural[200]};
  background-color: ${theme.colors.natural[100]};
  background-image: ${({ src }) => (src ? `url(${src})` : 'none')};
  background-size: cover;
  background-position: center;
  box-sizing: border-box;
`;

export const MenteeNameRow = styled(Row)`
  align-items: center;
`;

export const MenteeStatusPill = styled.span<{
  tone?: 'danger' | 'warning' | 'success' | 'info' | 'neutral';
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 700;

  ${({ tone = 'neutral' }) => {
    switch (tone) {
      case 'danger':
        return `
          background: #FEE2E2;
          color: #DC2626;
        `;
      case 'warning':
        return `
          background: #FFEDD5;
          color: #EA580C;
        `;
      case 'success':
        return `
          background: #F0FDF4;
          color: #16A34A;
        `;
      case 'info':
        return `
          background: #EFF6FF;
          color: #2563EB;
        `;
      case 'neutral':
      default:
        return `
          background: ${theme.colors.natural[100]};
          color: ${theme.colors.natural[700]};
        `;
    }
  }}
`;

export const MenteeHeaderRight = styled(Stack)`
  align-items: flex-end;
  gap: 4px;
`;

export const MetricGrid = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
`;

export const MetricCard = styled(Stack)`
  box-sizing: border-box;
  padding: 12px;
  gap: 8px;
  border-radius: 8px;
  background: ${theme.colors.natural[100]};
`;

export const MetricLabelRow = styled(Row)<{
  iconColor?: string;
}>`
  width: 100%;
  align-items: center;
  color: ${({ iconColor }) => iconColor ?? theme.colors.natural[700]};
`;

export const MetricValue = styled.div<{
  color?: string;
}>`
  font-family: 'Nimbus Sans', system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
  font-weight: 700;
  font-size: 18px;
  line-height: 28px;
  color: ${({ color }) => color ?? '#212121'};
`;

export const MetricProgressTrack = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 9999px;
  background: ${theme.colors.natural[200]};
  overflow: hidden;
`;

export const MetricProgressFill = styled.div<{
  percent: number;
  color?: string;
}>`
  width: ${({ percent }) => `${Math.max(0, Math.min(100, percent))}%`};
  height: 100%;
  border-radius: inherit;
  background: ${({ color }) => color ?? theme.colors.primary[500]};
`;

export const MenteeFooter = styled(Row)`
  width: 100%;
  padding-top: 20px;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid #F3F4F6;
`;

export const SubjectBadge = styled.span<{
  tone: 'purple' | 'green';
}>`
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;

  ${({ tone }) => {
    switch (tone) {
      case 'purple':
        return `
          background: #FAF5FF;
          color: #9333EA;
        `;
      case 'green':
      default:
        return `
          background: #F0FDF4;
          color: #16A34A;
        `;
    }
  }}
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  height: 48px;
  border: none;
  cursor: pointer;
  border-radius: 8px;

  background: ${theme.colors.primary[500]};
  color: ${theme.colors.white};
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0px 4px 6px -1px rgba(0, 0, 0, 0.1),
    0px 2px 4px -2px rgba(0, 0, 0, 0.1);
  transition: 0.12s;

  &:hover {
    background: ${theme.colors.primary[600]};
  }
`;

export const BottomSection = styled(Row)`
  width: 100%;
  gap: 24px;
  justify-content: center;
  align-items: flex-start;
`;

export const BottomCardBase = styled(Stack)`
  box-sizing: border-box;
  padding: 24px;
  gap: 16px;
  border-radius: 12px;
  border: 1px solid ${theme.colors.natural[200]};
  background: ${theme.colors.bg.primary};
  flex: 1;
  min-height: 210px;
`;

export const WeeklyCard = styled(BottomCardBase)`
  background: ${theme.colors.bg.primary};
`;

export const TipCard = styled(BottomCardBase)`
  background: linear-gradient(135deg, #E8F5E9 0%, #FFFFFF 100%);
  border: 1px solid rgba(76, 175, 80, 0.3);
`;

export const BottomCardTitleRow = styled(Row)`
  width: 100%;
  align-items: center;
`;

export const WeeklyRows = styled(Stack)`
  width: 100%;
  gap: 12px;
`;

export const WeeklyRow = styled(Row)`
  width: 100%;
  align-items: center;
  justify-content: space-between;
`;

export const WeeklyBarGroup = styled(Row)`
  align-items: center;
`;

export const WeeklyBarTrack = styled.div`
  width: 128px;
  height: 8px;
  border-radius: 9999px;
  background: ${theme.colors.natural[200]};
  overflow: hidden;
`;

export const WeeklyBarFill = styled.div<{
  percent: number;
}>`
  height: 8px;
  width: ${({ percent }) => `${Math.max(0, Math.min(100, percent))}%`};
  border-radius: 9999px;
  background: ${theme.colors.primary[500]};
`;

export const TipRows = styled(Stack)`
  width: 100%;
  gap: 12px;
`;

export const TipRow = styled(Row)`
  width: 100%;
  align-items: flex-start;
`;

export const TipCheckCircle = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 9999px;
  background: rgba(76, 175, 80, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 2px;
  color: ${theme.colors.primary[500]};
`;