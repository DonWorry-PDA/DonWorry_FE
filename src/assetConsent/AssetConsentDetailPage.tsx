import { useNavigate, useParams } from 'react-router-dom'
import AppBar from '../common/components/AppBar'

type TextSection = {
  type?: 'text'
  heading: string
  body: string
}

type TableSection = {
  type: 'table'
  heading: string
  rows: Array<{ label: string; content: string }>
}

type InfoSection = {
  type: 'info'
  heading: string
  body: string
}

type Section = TextSection | TableSection | InfoSection

interface ConsentConfig {
  appBarTitle: string
  name: string
  intro?: string
  sections: Section[]
}

const CONSENT_CONFIG: Record<string, ConsentConfig> = {
  collect: {
    appBarTitle: '수집·이용 동의서',
    name: '전송요구 및 개인(신용)정보 수집·이용 동의서',
    intro:
      '(주)신한은행은 신용정보의 이용 및 보호에 관한 법률, 개인정보 보호법 등 관련 법령에 따라 다음과 같이 귀하의 개인(신용)정보를 처리합니다.',
    sections: [
      {
        type: 'table',
        heading: '정보제공자(전송 요구를 받는 자)',
        rows: [{ label: '기관', content: '신한카드 외 271개' }],
      },
      {
        type: 'table',
        heading: '정보제공받는 자',
        rows: [{ label: '기관', content: '(주)신한은행' }],
      },
      {
        heading: '전송요구 정보',
        body: '· 은행 : 수신, 펀드, 신탁, ISA, 대출, 퇴직연금, 선불카드, 숨은 금융자산(미출연) 목록 및 정보\n· 카드 : 카드, 선불카드 목록 및 정보\n· 증권 : 계좌, 퇴직연금 목록 및 정보\n· 보험 : (계약자) 보험증권, 대출계좌, 퇴직연금, 숨은금융(피보험자) 보험증권, 숨은금융 목록 및 정보\n· 페이 : 선불전자지급수단, 계정목록 및 정보\n· 할부금융 : 계좌(대출/운용리스) 목록 및 정보\n· 기타 : 보증보험증권, 숨은 금융자산(출연) 목록 및 정보\n· 통신 : 통신 계약 목록 및 정보',
      },
      {
        heading: '수집·이용 목적',
        body: '전송요구를 통한 본인신용정보 통합조회, 데이터분석 서비스의 이용',
      },
      {
        heading: '보유 및 이용기간',
        body: '아래 중 가장 먼저 도래하는 기간\n서비스 이용 종료시까지 / 삭제 요구시까지 / 마지막 로그인 일로부터 1년 경과 시 까지',
      },
      {
        heading: '정기적 전송 및 보유기간',
        body: '금융자산 정보를 자동으로 주 1회 업데이트 진행\n새로운 정보를 5년 동안 조회\n* 6개월 동안 로그인하지 않으실 경우 정기적 전송이 자동 중단 됩니다.',
      },
      {
        heading: '수집·이용 항목',
        body: '개인(식별)정보(전자서명, 접근토큰, 인증서, 전송요구서)\n전송 요구에 기재된 전송을 요구하는 개인신용정보',
      },
      {
        heading: '상세 수집항목(신중하게 결정해주세요)',
        body: '상품구매 카테고리 정보를 수집합니다.\n* 실 구매 상품이 아닌 해당 상품의 카테고리가 포함되어 있습니다.\n\n가맹점명 및 사업자등록번호 정보를 수집합니다.\n* 본인 소비생활에 관련된 상세정보가 포함되어 있습니다.\n\n적요 또는 거래메모 정보를 선택해주세요.\n* 본인 사생활 및 경제활동 등에 관련된 정보가 포함되어 있습니다.',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '개인(신용)정보 수집·이용에 관한 동의를 거부하실 수 있습니다. 필수 및 선택 항목에 대한 수집·이용 동의 거부 시 본인신용정보 통합조회, 데이터분석 서비스의 이용이 제한될 수 있습니다.',
      },
    ],
  },

  provide: {
    appBarTitle: '정보 제공 동의서',
    name: '개인(신용)정보 제공 동의서',
    sections: [
      {
        type: 'table',
        heading: '제공받는 자',
        rows: [{ label: '기관', content: '신한카드 외 271개' }],
      },
      {
        heading: '제공받는 자의 이용목적',
        body: '본인 확인 및 개인(신용)정보의 전송',
      },
      {
        heading: '보유 및 이용기간',
        body: '본인 확인 및 개인(신용)정보의 전송 목적 달성시까지',
      },
      {
        heading: '제공항목',
        body: '전자서명, CI, 인증서, 전송요구서',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '개인(신용)정보 제공에 관한 동의를 거부하실 수 있습니다. 다만, 본인신용정보 통합조회, 데이터분석 서비스 이용을 위해서는 해당 동의서 동의가 필요합니다.',
      },
    ],
  },

  provideKcis: {
    appBarTitle: '정보 제공 동의서(한국신용정보원)',
    name: '개인(신용)정보 제공 동의서(한국신용정보원)',
    sections: [
      {
        type: 'table',
        heading: '제공받는 자',
        rows: [{ label: '기관', content: '한국신용정보원' }],
      },
      {
        heading: '제공받는 자의 이용목적',
        body: '마이데이터서비스 가입현황 안내 및 전송요구내역 통합조회 서비스 제공',
      },
      {
        heading: '보유 및 이용기간',
        body: '한국신용정보원의 마이데이터서비스 가입현황 안내 및 전송요구내역 통합조회서비스 목적 달성시까지',
      },
      {
        heading: '제공항목',
        body: '회원 가입여부, 서비스목록수, 서비스목록, 클라이언트 ID, 전송요구내역수, 전송요구내역목록, 정보제공자 기관코드, 권한 범위, 전송요구일자, 전송요구종료시점',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '개인(신용)정보 제공에 관한 동의를 거부하실 수 있습니다. 다만, 마이데이터 서비스 가입현황 안내 및 전송요구내역 통합조회 서비스 이용을 위해서는 해당 동의서 동의가 필요합니다.',
      },
    ],
  },
}

function SectionBlock({ section }: { section: Section }) {
  if (section.type === 'table') {
    return (
      <div className="flex flex-col gap-[9px]">
        <h2 className="text-md font-extrabold text-ink">{section.heading}</h2>
        <div className="overflow-hidden rounded-[12px] border border-line">
          {section.rows.map((row, idx) => (
            <div
              key={idx}
              className={`flex items-stretch ${idx < section.rows.length - 1 ? 'border-b border-divider' : ''}`}
            >
              <div className="w-[104px] shrink-0 border-r border-divider bg-surface px-3 py-[11px]">
                <span className="text-caption font-bold text-ink-sub">{row.label}</span>
              </div>
              <div className="flex-1 px-3 py-[11px]">
                <p className="text-caption leading-[1.66] text-ink-sub">{row.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (section.type === 'info') {
    return (
      <div className="flex flex-col gap-3">
        <h2 className="text-md font-extrabold text-ink">{section.heading}</h2>
        <div className="rounded-[12px] bg-[#f1f5fb] px-[14px] py-3">
          <p className="text-caption leading-[1.66] text-ink-sub">{section.body}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-md font-extrabold text-ink">{section.heading}</h2>
      <p className="whitespace-pre-line text-sub leading-[1.83] text-ink-sub">{section.body}</p>
    </div>
  )
}

function AssetConsentDetailPage() {
  const navigate = useNavigate()
  const { consentId = 'collect' } = useParams<{ consentId: string }>()
  const consent = CONSENT_CONFIG[consentId]

  if (!consent) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="동의서" onBack={() => navigate('/onboarding/asset-consent')} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body text-ink-sub">동의서 정보를 찾을 수 없어요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title={consent.appBarTitle} onBack={() => navigate('/onboarding/asset-consent')} />

      <main className="flex-1 overflow-y-auto px-5 pb-12">
        <div className="mb-[22px] mt-6 flex items-center justify-between rounded-card-lg bg-surface p-[17px]">
          <p className="text-body font-bold text-ink">{consent.name}</p>
          <span className="ml-3 shrink-0 rounded-badge bg-primary-tint px-[9px] py-[3px] text-caption font-bold text-primary">
            필수
          </span>
        </div>

        {consent.intro && (
          <p className="mb-[22px] text-sub leading-relaxed text-ink-sub">{consent.intro}</p>
        )}

        <div className="flex flex-col gap-[22px]">
          {consent.sections.map((section, idx) => (
            <SectionBlock key={idx} section={section} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default AssetConsentDetailPage
