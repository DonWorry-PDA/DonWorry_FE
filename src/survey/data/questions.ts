import type { SurveyQuestionData } from '../types/survey'

export const questions: SurveyQuestionData[] = [
  {
    question: '모아둔 돈이 한달 새\n5% 줄어든다면요?',
    subtitle: '정답은 없어요. 평소 마음에 가까운 것을 골라주세요.',
    options: [
      { label: '잠이 안 올 것 같아요', subLabel: '원금이 줄어드는 건 피하고 싶어요' },
      { label: '신경 쓰이지만 기다릴 수 있어요', subLabel: '생활비만 안 흔들리면 괜찮아요' },
      { label: '크게 개의치 않아요', subLabel: '장기적으로 오르면 된다고 생각해요' },
    ],
  },
  {
    question: '둘 중 어느 쪽이\n더 마음 편하세요?',
    options: [
      { label: '적게 벌어도 일정한 쪽', subLabel: '예: 매달 60만원이 꼬박꼬박' },
      { label: '중간쯤', subLabel: '예: 보통 70만원, 적은 달은 55만원' },
      { label: '출렁여도 더 벌 가능성이 있는 쪽', subLabel: '예: 많은 달 90만원, 적은 달 40만원' },
    ],
  },
  {
    question: '돈을 굴리는\n가장 큰 이유는 무엇인가요?',
    options: [
      { label: '매달 생활비를 만들고 싶어요' },
      { label: '물가만큼은 지키고 싶어요', subLabel: '가진 돈의 가치가 줄지 않게' },
      { label: '자산을 더 키우고 싶어요' },
    ],
  },
  {
    question: '자산을 가족에게\n남기고 싶은 마음이 있으세요?',
    subtitle: '원금을 얼마나 지킬지 정하는 데 참고해요.',
    options: [
      { label: '가능한 한 남기고 싶어요', subLabel: '원금은 최대한 지켜요' },
      { label: '쓸 만큼 쓰고, 남으면 좋고요' },
      { label: '제 생활이 우선이에요', subLabel: '원금을 조금씩 쓰는 것도 괜찮아요' },
    ],
  },
]
