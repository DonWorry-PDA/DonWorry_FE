interface Institution {
  id: string
  name: string
  initial: string
  color: string
  status: 'success' | 'error'
}

const MOCK_INSTITUTIONS: Institution[] = [
  { id: '1', name: '신한은행', initial: '신한', color: '#0046FF', status: 'success' },
  { id: '2', name: '신한투자증권', initial: '신투', color: '#0046FF', status: 'success' },
  { id: '3', name: 'IRP · 연금저축', initial: 'IRP', color: '#DD7A06', status: 'success' },
  { id: '4', name: '국민은행', initial: 'KB', color: '#FFBC00', status: 'success' },
  { id: '5', name: '우리은행', initial: '우리', color: '#0070C0', status: 'success' },
  { id: '6', name: '하나은행', initial: '하나', color: '#00A651', status: 'success' },
  { id: '7', name: '신한카드', initial: '신카', color: '#0046FF', status: 'success' },
  { id: '8', name: '삼성생명', initial: '삼성', color: '#1428A0', status: 'success' },
  { id: '9', name: '미래에셋증권', initial: '미래', color: '#E8000D', status: 'success' },
  { id: '10', name: 'NH농협은행', initial: 'NH', color: '#009500', status: 'success' },
  { id: '11', name: 'IBK기업은행', initial: 'IBK', color: '#3366CC', status: 'success' },
  { id: '12', name: 'KB증권', initial: 'KB', color: '#FFB700', status: 'success' },
  { id: '13', name: '신한라이프', initial: '신라', color: '#0046FF', status: 'success' },
]

const SUCCESS_COUNT = MOCK_INSTITUTIONS.filter(i => i.status === 'success').length

interface Props {
  onClose: () => void
}

function AssetConnectedDetail({ onClose }: Props) {
  return (
    <div className="flex h-dvh flex-col bg-white">
      {/* AppBar */}
      <div className="flex items-center justify-between px-6 pt-12 pb-4">
        <h2 className="text-card font-bold text-ink">자산 연결 결과</h2>
        <button type="button" onClick={onClose} aria-label="닫기" className="text-ink">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="flex flex-1 flex-col items-center overflow-y-auto px-6 pt-6">
        {/* 체크 아이콘 */}
        <div className="flex size-14 items-center justify-center rounded-full bg-primary">
          <svg width="24" height="18" viewBox="0 0 24 18" fill="none" aria-hidden="true">
            <path d="M2 9L8.5 15.5L22 2" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <h1 className="mt-4 text-heading font-bold text-ink">자산정보 연결결과</h1>

        {/* 요약 */}
        <div className="mt-4 flex w-full items-center gap-2">
          <span className="rounded-badge border border-primary px-2.5 py-0.5 text-sub font-bold text-primary">
            마이데이터
          </span>
          <p className="text-body text-ink">
            <span className="font-bold text-primary">{SUCCESS_COUNT}</span>
            개 기관의 자산을 연결했어요.
          </p>
        </div>

        <div className="mt-3 w-full border-b border-line" />
      </div>

      {/* 기관 목록 */}
      <ul className="flex-1 overflow-y-auto px-6">
        {MOCK_INSTITUTIONS.map(inst => (
          <li key={inst.id} className="flex items-center gap-4 border-b border-divider py-4">
            {/* 기관 아이콘 */}
            <div
              className="flex size-10 shrink-0 items-center justify-center rounded-full"
              style={{ backgroundColor: inst.color }}
            >
              <span className="text-caption font-bold text-white">{inst.initial}</span>
            </div>

            <span className="flex-1 text-body font-medium text-ink">{inst.name}</span>

            {inst.status === 'success' ? (
              <span className="text-sub text-success">연결됨</span>
            ) : (
              <span className="text-sub text-danger">오류</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default AssetConnectedDetail
