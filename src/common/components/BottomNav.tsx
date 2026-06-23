import { useLocation, useNavigate } from 'react-router-dom'
import { NavHomeIc, NavAssetIc, NavCalendarIc, NavMypageIc } from '../assets/icons'
import type { ComponentType, SVGProps } from 'react'

type NavItem = {
  label: string
  path: string
  Icon: ComponentType<SVGProps<SVGSVGElement>>
  activeFor?: string[]
}

const NAV_ITEMS: NavItem[] = [
  { label: '홈', path: '/home', Icon: NavHomeIc },
  { label: '자산관리', path: '/asset-management', Icon: NavAssetIc },
  { label: '캘린더', path: '/calendar', Icon: NavCalendarIc },
  {
    label: '마이페이지',
    path: '/mypage',
    Icon: NavMypageIc,
    activeFor: ['/notification'],
  },
]

function isTabActive(pathname: string, path: string, activeFor?: string[]) {
  const ownedPaths = [path, ...(activeFor ?? [])]
  return ownedPaths.some(
    (p) => pathname === p || pathname.startsWith(p + '/'),
  )
}

function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="flex h-[84px] items-start justify-center border-t border-line bg-white px-2 pt-[9px] pb-[26px] shrink-0 w-full">
      {NAV_ITEMS.map(({ label, path, Icon, activeFor }) => {
        const active = isTabActive(pathname, path, activeFor)
        return (
          <button
            key={path}
            onClick={() => navigate(path)}
            aria-current={active ? 'page' : undefined}
            className="flex flex-1 flex-col items-center justify-center gap-1"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <Icon
              width={23}
              height={23}
              className={active ? 'text-ink' : 'text-nav'}
            />
            <span
              className={`text-caption ${active ? 'font-bold text-ink' : 'font-medium text-nav'}`}
            >
              {label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav
