import type { SurveyQuestionData } from '../types/survey'

export const questions: SurveyQuestionData[] = [
  {
    question: '어느 정도까지\n줄어도 괜찮으세요?',
    description: [
      '노후에 투자한 돈에서 매달 생활비를 꺼내 쓴다고 생각해 보세요.',
      '시장이 나빠지면 한동안 꺼내 쓸 수 있는 돈이 줄어들 수 있어요.',
    ],
    options: [
      { label: '원금은 반드시 지켜져야 합니다', score: 0 },
      { label: '10% 내외 감소는 감수할 수 있습니다', score: 1 },
      { label: '20% 내외 하락까지는 견딜 수 있습니다', score: 2 },
      { label: '30% 이상 하락해도 회복을 기다릴 수 있습니다', score: 3 },
    ],
  },
  {
    question: '어떤 방식이 더 마음 편하세요?',
    description: ['매달 받는 금액의 안정성과 수익 가능성, 어느 쪽이 더 중요한지 골라주세요.'],
    options: [
      { label: '매월 수령액이 일정한 것이 중요합니다', score: 0 },
      { label: '주로 안정적이되, 수익을 위한 소폭 변동은 괜찮습니다', score: 1 },
      { label: '평균 수령액이 높다면 월별 변동은 감수할 수 있습니다', score: 2 },
    ],
  },
  {
    question: '남은 자산에 대한 생각에\n가장 가까운 것은요?',
    description: ['원금을 얼마나 지킬지 정하는 데 참고해요.'],
    options: [
      { label: '최대한 많은 자산을 자녀에게 남기고 싶습니다', score: 0 },
      { label: '필요한 만큼 쓰고, 남은 자산은 자녀에게 물려줄 의향입니다', score: 1 },
      { label: '노후를 충분히 누리는 것이 최우선입니다', score: 2 },
    ],
  },
]
