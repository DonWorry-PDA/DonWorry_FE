import type { ManageMenuKey, MenuIconTone } from '../types/asset'

const TONE_BOX: Record<MenuIconTone, string> = {
  primary: 'bg-primary text-white',
  blue:    'bg-card-blue text-white',
  coral:   'bg-card-coral text-white',
  pink:    'bg-card-pink text-white',
  yellow:  'bg-card-yellow text-white',
  mint:    'bg-card-mint text-white',
  warning: 'bg-warning-bg text-warning',
  muted:   'bg-surface text-ink-sub',
}

const PATHS: Record<ManageMenuKey, React.ReactNode> = {
  // 지갑
  salaryMaking: (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2.5" />
      <path d="M3 10h18" />
      <circle cx="16.5" cy="13.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  // 계기판
  lifeStability: (
    <>
      <path d="M4 17a8 8 0 0 1 16 0" />
      <path d="M12 17l4-4" />
      <circle cx="12" cy="17" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  // 돋보기
  investmentCheck: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="M20 20l-4.5-4.5" />
    </>
  ),
  // 시계
  pensionDefer: (
    <>
      <circle cx="12" cy="12" r="8" />
      <path d="M12 8v4l2.5 2" />
    </>
  ),
  // 슬라이더
  retirementSim: (
    <>
      <path d="M4 9h8" />
      <circle cx="15" cy="9" r="2" />
      <path d="M17 9h3" />
      <path d="M4 15h3" />
      <circle cx="9" cy="15" r="2" />
      <path d="M11 15h9" />
    </>
  ),
  // 문서
  monthlyReport: (
    <>
      <path d="M6 3.5h7l5 5V20a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1z" />
      <path d="M13 3.5V9h5" />
      <path d="M8.5 13h7M8.5 16.5h5" />
    </>
  ),
  purposeAccount: (
    <>
      <path d="M5 7.5h14v10.5a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V7.5z" />
      <path d="M8 7.5V5.8A1.8 1.8 0 0 1 9.8 4h4.4A1.8 1.8 0 0 1 16 5.8v1.7" />
      <path d="M8.5 12h7M8.5 15.5h4" />
    </>
  ),
}

function MenuIcon({ menuKey, tone }: { menuKey: ManageMenuKey; tone: MenuIconTone }) {
  return (
    <span className={`rounded-icon flex size-8 items-center justify-center ${TONE_BOX[tone]}`}>
      <svg
        aria-hidden="true"
        focusable="false"
        width={18}
        height={18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {PATHS[menuKey]}
      </svg>
    </span>
  )
}

export default MenuIcon
