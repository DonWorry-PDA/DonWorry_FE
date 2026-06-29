import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import AppBar from '../common/components/AppBar'
import Button from '../common/components/Button'
import StickyFooter from '../common/components/StickyFooter'
import type { ConsultContext } from './constants/consultContext'
import type { Branch } from './types/paycheckPlan'

const BRANCHES: Branch[] = [
  {
    id: '1',
    name: '신한투자증권 서소문 PWM센터',
    type: 'PWM',
    address: '서울 중구 서소문로 100',
    hours: '평일 09:00–16:00',
    available: true,
    distance: '0.4km',
  },
  {
    id: '2',
    name: '신한은행 광화문점',
    type: '영업점',
    address: '서울 종로구 새문안로 50',
    hours: '평일 09:00–16:00',
    available: true,
    distance: '0.9km',
  },
  {
    id: '3',
    name: '신한 PWM 강남파이낸스센터',
    type: 'PWM',
    address: '서울 강남구 테헤란로 152',
    hours: '평일 09:00–16:00',
    available: true,
    distance: '1.2km',
  },
  {
    id: '4',
    name: '신한 PWM 여의도센터',
    type: 'PWM',
    address: '서울 영등포구 여의대로 70',
    hours: '평일 09:00–16:00',
    available: false,
    distance: '2.1km',
  },
  {
    id: '5',
    name: '신한 PWM 잠실센터',
    type: 'PWM',
    address: '서울 송파구 올림픽로 300',
    hours: '평일 09:00–16:00',
    available: false,
    distance: '3.7km',
  },
]

type LocationState = { context?: ConsultContext; planId?: string | number | null }

function PaycheckBranchSelectPage() {
  const navigate = useNavigate()
  const { state } = useLocation() as { state: LocationState | null }
  const [query, setQuery] = useState('')
  const [selectedId, setSelectedId] = useState<string>(BRANCHES[0].id)

  const filtered = query
    ? BRANCHES.filter((b) => b.name.includes(query) || b.address.includes(query))
    : BRANCHES

  const handleConfirm = () => {
    const selectedBranch = BRANCHES.find((b) => b.id === selectedId)
    navigate('/paycheck-plan/consult', {
      state: { ...state, branch: selectedBranch },
    })
  }

  return (
    <div className="flex flex-col h-dvh">
      <AppBar title="지점 선택" onBack={() => navigate(-1)} />

      {/* 검색바 — 고정 영역 */}
      <div className="px-5 pt-3 pb-3 shrink-0">
        <div className="flex items-center bg-canvas rounded-[13px] px-3.5 h-12 gap-2.5">
          <svg width="17" height="18" fill="none" viewBox="0 0 17 18" className="shrink-0 text-ink-hint">
            <circle cx="7.5" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M11.5 13l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="지점명·지역 검색 (예: 서소문, 강남)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-[13.9px] text-ink placeholder:text-ink-hint outline-none"
          />
        </div>
      </div>

      {/* 정렬 기준 — 고정 영역 */}
      <div className="flex items-center justify-between px-5 pb-2 shrink-0">
        <span className="text-sub text-ink-hint">
          가까운 순 · {filtered.length}곳
        </span>
        <button className="text-sub font-semibold text-primary">내 위치 기준</button>
      </div>

      {/* 지점 목록 — 스크롤 영역 */}
      <div className="flex-1 min-h-0 overflow-y-auto">
        <ul>
          {filtered.map((branch) => (
            <li key={branch.id} className="border-t border-divider">
              <button
                className="w-full flex items-start gap-3 px-5 py-4 text-left"
                onClick={() => setSelectedId(branch.id)}
              >
                {/* 지점 아이콘 */}
                <div className="shrink-0 w-9 h-9 rounded-[11px] bg-[#edf2ff] flex items-center justify-center mt-0.5">
                  <svg width="18" height="18" fill="none" viewBox="0 0 18 18">
                    <path
                      d="M9 2C6.24 2 4 4.24 4 7c0 3.93 5 9 5 9s5-5.07 5-9c0-2.76-2.24-5-5-5z"
                      stroke="#0046ff"
                      strokeWidth="1.3"
                    />
                    <circle cx="9" cy="7" r="1.75" fill="#0046ff" />
                  </svg>
                </div>

                {/* 지점 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5 flex-wrap">
                    <span className="text-[14.5px] font-bold text-ink">{branch.name}</span>
                    <span
                      className={`shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-[6px] ${
                        branch.type === 'PWM'
                          ? 'bg-[#edf2ff] text-primary'
                          : 'bg-[#eef1f4] text-[#7e8893]'
                      }`}
                    >
                      {branch.type}
                    </span>
                  </div>
                  <p className="text-[12.2px] text-ink-sub mb-0.5">{branch.address}</p>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11.7px] text-ink-hint">{branch.hours}</span>
                    {branch.available && (
                      <>
                        <span className="text-ink-hint text-xs">·</span>
                        <span className="text-[11.7px] font-semibold text-[#15b47c]">상담 가능</span>
                      </>
                    )}
                  </div>
                </div>

                {/* 거리 + 선택 버튼 */}
                <div className="shrink-0 flex flex-col items-end gap-2">
                  <span className="text-[12.6px] font-extrabold text-primary">{branch.distance}</span>
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedId === branch.id
                        ? 'bg-primary'
                        : 'border-2 border-[#d6dce3]'
                    }`}
                  >
                    {selectedId === branch.id && (
                      <svg width="14" height="14" fill="none" viewBox="0 0 14 14">
                        <path
                          d="M3 7l3 3 5-5"
                          stroke="white"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <StickyFooter>
        <Button onClick={handleConfirm}>선택한 지점으로 예약</Button>
      </StickyFooter>
    </div>
  )
}

export default PaycheckBranchSelectPage
