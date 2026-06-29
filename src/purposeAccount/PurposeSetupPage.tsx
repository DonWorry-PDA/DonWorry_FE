import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '@/common/components/AppBar'
import Button from '@/common/components/Button'
import StickyFooter from '@/common/components/StickyFooter'
import { AccountType, ACCOUNT_META } from './types/purposeAccount'

const GUIDE_COPY: Record<AccountType, { summary: string }> = {
  medical: {
    summary: '병원비처럼 갑자기 필요한 돈',
  },
  travel: {
    summary: '쓸 시점이 정해진 계획 자금',
  },
  children: {
    summary: '용돈·학자금처럼 따로 챙길 돈',
  },
  gift: {
    summary: '축의·부조처럼 예측 어려운 돈',
  },
  emergency: {
    summary: '바로 꺼내 쓸 수 있는 예비 자금',
  },
  custom: {
    summary: '내 상황에 맞춰 따로 정할 돈',
  },
}

const PURPOSE_EMOJI: Record<AccountType, string> = {
  medical: '🏥',
  travel: '✈️',
  children: '🎓',
  gift: '🎁',
  emergency: '🛟',
  custom: '✨',
}

type LocationState = {
  selected?: AccountType[]
}

export default function PurposeSetupPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }
  const selected = state?.selected ?? []

  if (selected.length === 0) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="상담 연결" onBack={() => navigate(-1)} />

        <div className="flex flex-1 flex-col justify-center px-6">
          <h1 className="text-heading font-bold leading-snug text-ink">
            먼저 목적을
            <br />
            골라주세요
          </h1>
          <p className="mt-2 text-body text-ink-sub">
            관심 있는 목적을 선택하면 상담에서 볼 내용을 정리해드릴게요.
          </p>
        </div>

        <StickyFooter>
          <Button onClick={() => navigate('/purpose-account/select')}>
            목적 고르기
          </Button>
        </StickyFooter>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title="상담 연결" onBack={() => navigate(-1)} />

      <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
        <h1 className="text-heading font-bold leading-snug text-ink">
          이렇게 나눠볼 수 있어요
          <br />
          상담에서 이어서 도와드릴게요
        </h1>
        <p className="mt-2 text-body text-ink-sub">
          선택한 목적에 맞춰 통장 구분 방법을 안내해드려요.
        </p>

        <div className="mt-6 rounded-card-lg bg-primary p-5 text-white">
          <p className="text-sub text-white/75">상담에서 같이 정해요</p>
          <p className="mt-2 text-md font-bold leading-relaxed">
            계좌 개설 · 자동이체 · 목적별 관리 방식
          </p>
        </div>

        <div className="mt-5 flex flex-col gap-3">
          {selected.map((type) => {
            const meta = ACCOUNT_META[type]
            const copy = GUIDE_COPY[type]

            return (
              <div
                key={type}
                className="flex items-center gap-3 rounded-card-lg border border-line bg-white p-4"
              >
                <div
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-icon"
                  style={{ backgroundColor: meta.bgColor }}
                >
                  <span className="text-[22px]" aria-hidden="true">
                    {PURPOSE_EMOJI[type]}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-md font-bold text-ink">
                    {meta.label} 통장
                  </p>
                  <p className="mt-1 text-body text-ink-sub">{copy.summary}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 rounded-card bg-surface-muted px-4 py-3">
          <p className="text-body leading-relaxed text-ink-sub">
            실제 개설 여부와 상품 선택은 상담 단계에서 결정해요.
          </p>
        </div>
      </div>

      <StickyFooter>
        <div className="flex flex-col gap-3">
          <Button
            onClick={() =>
              navigate('/paycheck-plan/consult/branch', {
                state: { purposeAccountTypes: selected, institution: 'SHINHAN_BANK' },
              })
            }
          >
            상담 연결하기
          </Button>
          <Button variant="outline" onClick={() => navigate('/purpose-account/select')}>
            목적 다시 고르기
          </Button>
        </div>
      </StickyFooter>
    </div>
  )
}
