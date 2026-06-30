// import { NavHomeIc, NotificationIc } from '../../../common/assets/icons'
import type { CSSProperties } from 'react'
import { BackArrowIc } from '../../../common/assets/icons'

interface Props {
  onNext: () => void
  onPrev: () => void
}

function AssetIntro({ onNext, onPrev }: Props) {
  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* AppBar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <div className="flex items-center gap-3">
          <button type="button" onClick={onPrev} className="text-ink">
            <BackArrowIc width={24} height={24} />
          </button>
          <span className="text-card text-ink font-bold">자산연결</span>
        </div>
      </div>
      <div className="flex flex-1 min-h-0 flex-col items-center overflow-y-auto px-6 pt-8">
        <h1 className="text-heading text-ink w-full font-bold">
          내 자산, 한눈에
          <br />
          모아서 관리해요
        </h1>
        <p className="text-body text-ink-sub mt-2 w-full">
          흩어진 금융자산을 연결하면 생활비 충당 상태를 정확히 알 수 있어요.
        </p>

        {/* 흩어진 금융자산이 중앙 허브로 모이는 일러스트 (앱 토큰 색 사용, 외부 에셋 없음) */}
        <div className="mt-12 flex w-full justify-center">
          <svg
            width="248"
            height="210"
            viewBox="0 0 260 220"
            fill="none"
            role="img"
            aria-label="흩어진 금융자산이 한곳에 모이는 그림"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="assetHubShadow" x="-50%" y="-50%" width="200%" height="200%">
                <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#0046ff" floodOpacity="0.18" />
              </filter>
              <filter id="assetCardShadow" x="-40%" y="-40%" width="180%" height="180%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#0046ff" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* 부드러운 후광 */}
            <circle cx="130" cy="150" r="62" fill="#eef3ff" />

            {/* 중앙 허브 — 흰 원 + 미니 도넛(모인 자산 구성). 카드 3색이 도넛 세그먼트로 합쳐진다 */}
            <g className="animate-asset-hub">
              <circle cx="130" cy="150" r="44" fill="#ffffff" filter="url(#assetHubShadow)" />
              <g transform="rotate(-90 130 150)">
                <circle cx="130" cy="150" r="18.5" fill="none" stroke="#0046ff" strokeWidth="11" pathLength="100" strokeDasharray="50 100" strokeDashoffset="0" />
                <circle cx="130" cy="150" r="18.5" fill="none" stroke="#f97316" strokeWidth="11" pathLength="100" strokeDasharray="30 100" strokeDashoffset="-50" />
                <circle cx="130" cy="150" r="18.5" fill="none" stroke="#df3550" strokeWidth="11" pathLength="100" strokeDasharray="20 100" strokeDashoffset="-80" />
              </g>
            </g>

            {/* 흩어진 자산 카드 3장 — 크게, 비스듬히 흩뜨려 배치. 날아와(fly) 안착 후 계속 둥둥(float) */}
            <g transform="translate(64 74)">
              <g transform="rotate(-15)">
                <g className="animate-asset-float" style={{ animationDuration: '3.1s', animationDelay: '0.9s' } as CSSProperties}>
                  <g
                    className="animate-asset-card"
                    style={{ '--fly-x': '-54px', '--fly-y': '-10px', animationDelay: '0.08s' } as CSSProperties}
                  >
                    <g filter="url(#assetCardShadow)">
                      <rect x="-32" y="-21" width="64" height="42" rx="9" fill="#ffffff" stroke="#e7eaee" strokeWidth="1.5" />
                      <rect x="-21" y="-12" width="18" height="6" rx="3" fill="#3845ad" />
                      <rect x="-21" y="1" width="42" height="4" rx="2" fill="#edf0f4" />
                      <rect x="-21" y="10" width="27" height="4" rx="2" fill="#edf0f4" />
                    </g>
                  </g>
                </g>
              </g>
            </g>
            <g transform="translate(133 50)">
              <g transform="rotate(9)">
                <g className="animate-asset-float" style={{ animationDuration: '3.6s', animationDelay: '1.15s' } as CSSProperties}>
                  <g
                    className="animate-asset-card"
                    style={{ '--fly-x': '6px', '--fly-y': '-48px', animationDelay: '0.2s' } as CSSProperties}
                  >
                    <g filter="url(#assetCardShadow)">
                      <rect x="-32" y="-21" width="64" height="42" rx="9" fill="#ffffff" stroke="#e7eaee" strokeWidth="1.5" />
                      <rect x="-21" y="-12" width="18" height="6" rx="3" fill="#f97316" />
                      <rect x="-21" y="1" width="42" height="4" rx="2" fill="#edf0f4" />
                      <rect x="-21" y="10" width="27" height="4" rx="2" fill="#edf0f4" />
                    </g>
                  </g>
                </g>
              </g>
            </g>
            <g transform="translate(196 78)">
              <g transform="rotate(-7)">
                <g className="animate-asset-float" style={{ animationDuration: '3.3s', animationDelay: '1.0s' } as CSSProperties}>
                  <g
                    className="animate-asset-card"
                    style={{ '--fly-x': '54px', '--fly-y': '-8px', animationDelay: '0.32s' } as CSSProperties}
                  >
                    <g filter="url(#assetCardShadow)">
                      <rect x="-32" y="-21" width="64" height="42" rx="9" fill="#ffffff" stroke="#e7eaee" strokeWidth="1.5" />
                      <rect x="-21" y="-12" width="18" height="6" rx="3" fill="#df3550" />
                      <rect x="-21" y="1" width="42" height="4" rx="2" fill="#edf0f4" />
                      <rect x="-21" y="10" width="27" height="4" rx="2" fill="#edf0f4" />
                    </g>
                  </g>
                </g>
              </g>
            </g>

          </svg>
        </div>

        <p className="text-sub text-ink-sub mt-10 text-center">
          마이데이터인증서로 본인인증이 필요해요.
          <br />
          이용 중인 금융기관으로 안내 받으세요.
        </p>
      </div>

      <div className="relative shrink-0 px-6 pb-10">
        <div className="pointer-events-none absolute -top-8 inset-x-0 h-8 bg-gradient-to-b from-white/0 to-white" />
        <button
          type="button"
          onClick={onNext}
          className="rounded-btn bg-primary text-btn w-full py-4 font-bold text-white"
        >
          한번에 불러오기
        </button>
      </div>
    </div>
  )
}

export default AssetIntro
