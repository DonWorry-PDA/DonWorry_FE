import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatKrw } from '../../../common/utils/formatKrw'
import { useOnboarding } from '../../contexts/OnboardingContext'
import AssetConnectedDetail from './AssetConnectedDetail'
import CheckBadge from '../../../common/components/CheckBadge'

function AssetResult() {
  const navigate = useNavigate()
  const { connectResult } = useOnboarding()
  const [showDetail, setShowDetail] = useState(false)

  if (showDetail) {
    return <AssetConnectedDetail onClose={() => setShowDetail(false)} />
  }

  // 직접 진입 등으로 연결 결과가 없으면 구체 수치는 생략하고 폴백 문구를 보여준다.
  // connect 응답엔 기관명이 없고 개수(connectedInstitutions)만 있으므로 개수만 노출한다.
  const institutionsLabel = connectResult
    ? `${connectResult.connectedInstitutions}개 기관 연결`
    : '자산 연결 완료'
  const totalAsset = connectResult?.assetSummary.totalAsset ?? null

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <div className="flex flex-1 flex-col items-center px-6 pt-16">
        <CheckBadge />

        <h1 className="mt-6 text-heading font-bold text-ink">자산 연결 결과</h1>
        <p className="mt-2 text-body text-ink-sub">마이데이터로 연결된 자산을 한눈에 모아드려요.</p>

        {/* 마이데이터 연결 결과 — 탭하면 상세 페이지 */}
        <button
          type="button"
          onClick={() => setShowDetail(true)}
          className="mt-8 w-full rounded-card bg-surface p-4 text-left"
        >
          <div className="flex items-center justify-between">
            <span className="text-sub text-ink-sub">마이데이터</span>
            <div className="flex items-center gap-1 text-body text-ink">
              <span>{institutionsLabel}</span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </button>

        {totalAsset != null && (
          <div className="mt-4 w-full rounded-card bg-surface p-4">
            <div className="flex items-center justify-between">
              <span className="text-body text-ink-sub">연결된 총자산</span>
              <span className="font-inter text-card font-bold text-ink">{formatKrw(totalAsset)}</span>
            </div>
          </div>
        )}

        <p className="mt-4 text-center text-sub text-ink-sub">
          이제 생활비 충당 상태를 함께 살펴볼게요.
        </p>
      </div>

      <div className="px-6 pb-10">
        <button
          type="button"
          onClick={() => navigate('/home', { replace: true })}
          className="w-full rounded-btn bg-primary py-4 text-btn font-bold text-white"
        >
          시작하기
        </button>
      </div>
    </div>
  )
}

export default AssetResult
