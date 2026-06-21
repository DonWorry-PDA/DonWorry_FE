import type { SurveyQuestionData } from '../types/survey'

export const questions: SurveyQuestionData[] = [
  {
    question: '어느 정도까지\n줄어도 괜찮으세요?',
    description: [
      '노후에 투자한 돈에서 매달 생활비를 꺼내 쓴다고 생각해 보세요.',
      '시장이 나빠지면 한동안 꺼내 쓸 수 있는 돈이 줄어들 수 있어요.',
    ],
    options: [
      { label: '한 푼도 줄면 안 돼요', score: 0 },
      { label: '10% 정도는 괜찮아요', score: 1 },
      { label: '20%까지는 견딜 수 있어요', score: 2 },
      { label: '30% 넘게 출렁여도 기다릴 수 있어요', score: 3 },
    ],
  },
  {
    question: '어떤 방식이 더 마음 편하세요?',
    description: ['매달 받는 금액의 안정성과 수익 가능성, 어느 쪽이 더 중요한지 골라주세요.'],
    options: [
      { label: '매달 딱 정해진 금액이 좋아요', score: 0 },
      { label: '웬만하면 일정하되, 더 받을 기회면 조금 출렁여도 돼요', score: 1 },
      { label: '평균적으로 더 받을 수 있다면 매달 들쭉날쭉해도 괜찮아요', score: 2 },
    ],
  },
  {
    question: '남은 자산에 대한 생각에\n가장 가까운 것은요?',
    description: ['원금을 얼마나 지킬지 정하는 데 참고해요.'],
    options: [
      { label: '되도록 자녀에게 많이 남기고 싶어요', score: 0 },
      { label: '제가 쓸 만큼 쓰고, 남으면 물려줄게요', score: 1 },
      { label: '제 노후에 다 쓰는 게 우선이에요', score: 2 },
    ],
  },
]
