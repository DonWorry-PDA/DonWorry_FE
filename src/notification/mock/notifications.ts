import type { NotificationGroup } from '../types/notification'

export const MOCK_NOTIFICATIONS: NotificationGroup[] = [
  {
    label: '오늘',
    items: [
      {
        id: '1',
        title: '6월 27일 잔액이 부족할 수 있어요',
        subtitle: '카드값 전 예상 잔액 부족 · 2시간 전',
        isUnread: true,
      },
      {
        id: '2',
        title: '배당금이 입금됐어요',
        subtitle: '배당 ETF +100,000원 · 5시간 전',
      },
    ],
  },
  {
    label: '이번 주',
    items: [
      {
        id: '3',
        title: 'IRP 납입일이 다가와요 (D-3)',
        subtitle: '6월 25일 · 어제',
      },
      {
        id: '4',
        title: '6월 월간 리포트가 도착했어요',
        subtitle: '3일 전',
      },
      {
        id: '5',
        title: 'PB 상담이 예약되었어요',
        subtitle: '6월 19일 오전 10:30 · 4일 전',
      },
    ],
  },
]
