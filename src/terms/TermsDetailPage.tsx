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

interface TermConfig {
  appBarTitle: string
  name: string
  required: boolean
  date: string
  version?: string
  sections: Section[]
}

const TERMS_CONFIG: Record<string, TermConfig> = {
  service: {
    appBarTitle: '서비스 이용약관',
    name: '연금SOL사 서비스 이용약관',
    required: true,
    date: '2026.06.12',
    version: 'v2.0',
    sections: [
      {
        heading: '제1조 (목적)',
        body: '이 약관은 회원이 연금SOL사(이하 "회사")가 제공하는 은퇴자산 관리 서비스(이하 "서비스")를 이용함에 있어 회사와 회원 간의 권리·의무 및 책임사항, 이용조건과 절차를 규정함을 목적으로 합니다.',
      },
      {
        heading: '제2조 (용어의 정의)',
        body: '① "회원"이란 이 약관에 동의하고 회사와 이용계약을 체결한 자를 말합니다.\n② "자산연결"이란 회원이 보유한 금융기관 계좌의 잔액·거래내역을 회원 동의에 따라 조회·수집하는 기능을 말합니다.\n③ "현금흐름 진단"이란 수집된 자산정보로 예상 수입·지출과 인출 가능 금액을 분석해 제공하는 정보를 말합니다.',
      },
      {
        heading: '제3조 (약관의 효력 및 개정)',
        body: '① 회사는 이 약관의 내용을 회원이 쉽게 확인할 수 있도록 서비스 화면에 게시합니다.\n② 회사는 관련 법령을 위반하지 않는 범위에서 약관을 개정할 수 있으며, 개정 시 적용일자와 사유를 명시해 최소 7일 전(회원에게 불리한 개정은 30일 전)부터 공지합니다.',
      },
      {
        heading: '제4조 (서비스의 제공)',
        body: '① 회사는 자산연결, 현금흐름 진단, 인출 설계, 전문가 상담 연결 등의 서비스를 제공합니다.\n② 회사는 서비스 품질 향상을 위해 제공 내용을 변경할 수 있으며, 중요한 변경은 사전에 공지합니다.',
      },
      {
        heading: '제5조 (자산정보의 수집·이용)',
        body: '회사는 회원이 별도로 동의한 범위에서만 자산정보를 수집하며, 진단·설계 결과 제공 목적 외로 이용하지 않습니다. 회원은 언제든지 자산연결을 해제할 수 있고, 해제 시 관련 정보는 관계 법령이 정한 보관기간을 제외하고 지체 없이 파기됩니다.',
      },
      {
        heading: '제6조 (회원의 의무)',
        body: '① 회원은 본인의 정확한 정보를 제공해야 하며, 타인의 정보를 도용해서는 안 됩니다.\n② 회원은 서비스가 제공하는 정보를 투자 판단의 참고자료로 활용하며, 최종 결정과 그 결과는 회원 본인에게 귀속됩니다.',
      },
      {
        heading: '제7조 (책임의 한계)',
        body: '서비스가 제공하는 진단·설계 정보는 의사결정을 돕기 위한 참고 자료이며, 특정 금융상품 가입을 권유하거나 수익을 보장하지 않습니다. 천재지변, 회원의 귀책 등 회사의 통제 범위를 벗어난 사유로 발생한 손해에 대해 회사는 책임을 지지 않습니다.',
      },
    ],
  },

  privacy: {
    appBarTitle: '개인정보 수집·이용',
    name: '개인정보 수집·이용 동의',
    required: true,
    date: '2026.06.12',
    sections: [
      {
        heading: '수집·이용 목적',
        body: '본인 확인 및 회원 식별, 현금흐름 진단·인출 설계 결과 제공, 고객 상담 응대 및 서비스 운영·개선에 이용합니다.',
      },
      {
        type: 'table',
        heading: '수집 항목',
        rows: [
          {
            label: '필수',
            content: '이름, 생년월일, 휴대전화번호, 본인확인값(CI/DI)',
          },
          {
            label: '자산정보',
            content: '회원이 연결한 계좌의 잔액·거래내역·보유상품',
          },
          {
            label: '자동수집',
            content: '접속기기 정보, 서비스 이용기록',
          },
        ],
      },
      {
        heading: '보유·이용 기간',
        body: '회원 탈퇴 또는 동의 철회 시까지 보유하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간 동안 분리 보관 후 파기합니다.',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '동의를 거부할 권리가 있으나, 필수 항목에 동의하지 않으면 서비스 이용이 제한됩니다.',
      },
    ],
  },

  biometric: {
    appBarTitle: '고유식별정보 처리',
    name: '고유식별정보 처리 동의',
    required: true,
    date: '2026.06.12',
    sections: [
      {
        heading: '처리 근거',
        body: '금융실명법·전자금융거래법 등 관계 법령에 따른 실명확인 및 본인확인을 위해 고유식별정보를 처리합니다.',
      },
      {
        type: 'table',
        heading: '처리 항목',
        rows: [{ label: '항목', content: '주민등록번호' }],
      },
      {
        heading: '처리 목적',
        body: '실명 확인, 연결 계좌의 예금주 일치 여부 확인, 부정 이용 방지를 위해 처리합니다.',
      },
      {
        heading: '보유 기간',
        body: '본인확인 완료 즉시 파기하며, 법령상 보존 의무가 있는 경우 해당 기간 동안만 안전하게 보관합니다.',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '동의를 거부할 수 있으나, 미동의 시 실명확인이 필요한 자산연결 기능을 이용할 수 없습니다.',
      },
    ],
  },

  electronic: {
    appBarTitle: '전자금융거래 약관',
    name: '전자금융거래 이용약관',
    required: true,
    date: '2026.06.12',
    version: 'v1.4',
    sections: [
      {
        heading: '제1조 (목적 및 정의)',
        body: '이 약관은 회사가 제공하는 전자적 장치를 통한 금융거래(이하 "전자금융거래")의 이용 조건과 절차를 정합니다. "접근매체"란 거래 지시나 이용자·거래내용의 진실성을 확인하기 위한 수단을 말합니다.',
      },
      {
        heading: '제2조 (거래내용의 확인)',
        body: '① 회사는 회원이 전자금융거래 내용을 확인할 수 있도록 서비스 화면에 거래기록을 제공합니다.\n② 회원이 서면 교부를 요청하면 회사는 요청을 받은 날부터 2주 이내에 제공합니다.',
      },
      {
        heading: '제3조 (오류의 정정)',
        body: '① 회원은 전자금융거래에 오류가 있음을 안 때에는 회사에 정정을 요구할 수 있습니다.\n② 회사는 정정 요구를 받은 날부터 2주 이내에 처리 결과를 회원에게 알립니다.',
      },
      {
        heading: '제4조 (회사의 책임)',
        body: '접근매체의 위조·변조, 전자적 전송·처리 과정에서 발생한 사고로 회원에게 손해가 발생한 경우 회사는 관련 법령에 따라 책임을 부담합니다. 다만 회원의 고의·중과실이 있는 경우 그 책임의 일부 또는 전부가 회원에게 있을 수 있습니다.',
      },
      {
        heading: '제5조 (분쟁처리 및 조정)',
        body: '회원은 서비스 내 고객센터를 통해 분쟁처리를 신청할 수 있으며, 회사의 처리 결과에 이의가 있는 경우 금융감독원 또는 금융분쟁조정위원회에 조정을 신청할 수 있습니다.',
      },
    ],
  },

  thirdParty: {
    appBarTitle: '개인정보 제3자 제공',
    name: '개인정보 제3자 제공 동의',
    required: false,
    date: '2026.06.12',
    sections: [
      {
        type: 'table',
        heading: '제공받는 자',
        rows: [
          { label: '제휴기관', content: '자산정보 통합조회 제휴 금융기관' },
          { label: '수탁업무', content: '연결 자산의 조회 및 통합 진단' },
        ],
      },
      {
        heading: '제공 항목',
        body: '이름, 본인확인값(CI), 회원이 연결한 자산정보(잔액·보유상품)',
      },
      {
        heading: '제공 목적',
        body: '여러 금융기관에 흩어진 자산을 한 화면에서 통합 조회하고 진단 결과를 제공하기 위함입니다.',
      },
      {
        heading: '보유·이용 기간',
        body: '제공 목적 달성 시 또는 동의 철회 시까지 보유 후 지체 없이 파기합니다.',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '선택 항목으로, 동의하지 않아도 기본 서비스는 이용할 수 있으나 통합 자산조회 기능은 제한됩니다.',
      },
    ],
  },

  marketing: {
    appBarTitle: '마케팅 정보 수신',
    name: '마케팅 정보 수신 동의',
    required: false,
    date: '2026.06.12',
    sections: [
      {
        heading: '수신 정보',
        body: '혜택·이벤트 안내, 신규 서비스·상품 소식, 회원 맞춤형 금융정보를 보내드립니다.',
      },
      {
        type: 'table',
        heading: '수신 채널',
        rows: [{ label: '채널', content: '앱 푸시 알림, 문자(SMS/MMS), 이메일' }],
      },
      {
        heading: '보유 기간',
        body: '동의 철회 또는 회원 탈퇴 시까지 보유합니다.',
      },
      {
        heading: '철회 방법',
        body: '마이페이지 > 약관 및 동의 내역에서 언제든지 수신을 철회할 수 있습니다.',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '선택 항목으로, 동의하지 않아도 서비스 이용에는 영향이 없습니다.',
      },
    ],
  },

  account: {
    appBarTitle: '계좌 약관',
    name: '신한 은퇴솔루션 계좌 약관',
    required: true,
    date: '2026.06.12',
    version: 'v1.0',
    sections: [
      {
        heading: '제1조 (목적)',
        body: '이 약관은 신한투자증권(이하 "회사")이 운영하는 신한 은퇴솔루션 계좌(이하 "계좌")의 개설, 이용 및 해지에 관한 사항을 규정함을 목적으로 합니다.',
      },
      {
        heading: '제2조 (계좌의 특성)',
        body: '신한 은퇴솔루션 계좌는 은퇴 전문 자산관리 서비스와 연계된 전용 계좌로, 투자 진단·인출 설계 등 은퇴 설계 서비스를 통합 제공합니다.',
      },
      {
        heading: '제3조 (계좌 개설)',
        body: '① 계좌 개설을 원하는 자는 회사가 정한 소정의 절차에 따라 신청하여야 합니다.\n② 회사는 금융관계법령에서 정한 의무에 따라 실명 확인 및 본인 인증을 실시합니다.',
      },
      {
        heading: '제4조 (계좌 이용)',
        body: '① 계좌 보유자는 회사의 앱·웹 서비스를 통해 자산 조회, 입출금 내역 확인, 인출 설계 서비스를 이용할 수 있습니다.\n② 계좌 이용 한도·수수료 등 세부 사항은 회사가 별도로 공시한 기준에 따릅니다.',
      },
      {
        heading: '제5조 (계좌 해지)',
        body: '① 계좌 보유자는 언제든지 계좌 해지를 신청할 수 있습니다.\n② 계좌 해지 시 잔액이 있는 경우 회사가 정한 절차에 따라 환급처리됩니다.',
      },
    ],
  },

  deposit: {
    appBarTitle: '예금거래 기본약관',
    name: '예금거래 기본약관',
    required: true,
    date: '2026.06.12',
    version: 'v3.1',
    sections: [
      {
        heading: '제1조 (적용 범위)',
        body: '이 약관은 신한은행(이하 "은행")과 예금주 사이의 예금거래에 공통으로 적용됩니다.',
      },
      {
        heading: '제2조 (거래수단)',
        body: '예금주는 거래 인감·서명·비밀번호 등을 거래수단으로 사용하며, 분실·도난 등의 사고가 생겼을 때에는 지체 없이 은행에 신고하여야 합니다.',
      },
      {
        heading: '제3조 (예금의 입금)',
        body: '① 예금은 현금 또는 수표 등으로 입금하며, 타행 수표는 교환에 회부하여 결제된 때에 입금됩니다.\n② 잘못 입금된 경우 은행은 예금주에게 통보하고 지급할 수 있습니다.',
      },
      {
        heading: '제4조 (예금의 지급)',
        body: '① 은행은 만기가 된 예금을 즉시 지급하며, 기간 전 해지 시 해당 상품의 중도 해지 이율을 적용합니다.\n② 이자는 입금일부터 출금 전날까지 계산하여 지급합니다.',
      },
      {
        heading: '제5조 (이율 변경)',
        body: '금융시장 변화 등으로 이율을 변경할 경우에는 영업점 및 홈페이지에 게시하고 이후 거래분부터 변경 이율을 적용합니다.',
      },
    ],
  },

  'account-privacy': {
    appBarTitle: '개인정보 수집·이용',
    name: '개인정보 수집·이용 동의',
    required: true,
    date: '2026.06.12',
    sections: [
      {
        heading: '수집·이용 목적',
        body: '계좌 개설 및 금융거래 관계의 설정·유지·이행·관리, 금융사고 조사·예방 및 민원 처리에 이용합니다.',
      },
      {
        type: 'table',
        heading: '수집 항목',
        rows: [
          { label: '필수', content: '성명, 생년월일, 성별, 휴대전화번호, 자택주소' },
          { label: '금융정보', content: '계좌번호, 거래내역, 잔액, 보유상품 정보' },
          { label: '자동수집', content: '서비스 이용기록, 접속 기기 정보' },
        ],
      },
      {
        heading: '보유·이용 기간',
        body: '계좌 해지일로부터 5년간 보유하며, 관계 법령에 따라 보존이 필요한 경우 해당 기간까지 안전하게 보관 후 파기합니다.',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '동의를 거부할 권리가 있으나, 필수 항목에 동의하지 않으면 계좌 개설이 제한됩니다.',
      },
    ],
  },

  'account-third-party': {
    appBarTitle: '개인정보 제3자 제공',
    name: '개인정보 제3자 제공 동의',
    required: true,
    date: '2026.06.12',
    sections: [
      {
        type: 'table',
        heading: '제공받는 자 및 목적',
        rows: [
          { label: '예금보험공사', content: '예금자 보호를 위한 예금보험 처리' },
          { label: '금융결제원', content: '지급결제 처리 및 계좌 이상거래 탐지' },
          { label: '신용정보원', content: '신용정보 조회 및 금융사고 예방' },
        ],
      },
      {
        heading: '제공 항목',
        body: '성명, 생년월일, 계좌번호, 거래일자·금액, 본인확인값(CI)',
      },
      {
        heading: '보유·이용 기간',
        body: '제공 목적 달성 시까지 보유하며, 법령상 의무 보존 기간이 있는 경우 해당 기간까지 보관합니다.',
      },
      {
        type: 'info',
        heading: '동의 거부 권리',
        body: '계좌 운영을 위한 필수 항목으로, 동의하지 않으면 계좌 개설이 불가합니다.',
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

function TermsDetailPage() {
  const navigate = useNavigate()
  const { termId = 'service' } = useParams<{ termId: string }>()
  const term = TERMS_CONFIG[termId]

  if (!term) {
    return (
      <div className="flex h-dvh flex-col bg-white">
        <AppBar title="약관" onBack={() => navigate(-1)} />
        <div className="flex flex-1 items-center justify-center">
          <p className="text-body text-ink-sub">약관 정보를 찾을 수 없어요.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh flex-col bg-white">
      <AppBar title={term.appBarTitle} onBack={() => navigate(-1)} />

      <main className="flex-1 overflow-y-auto px-6 pb-12">
        {/* 약관 메타 카드 */}
        <div className="mb-[22px] mt-6 flex items-center justify-between rounded-card-lg bg-surface p-[17px]">
          <div className="flex flex-col gap-[5px]">
            <p className="text-body font-bold text-ink">{term.name}</p>
            <p className="text-caption text-ink-hint">
              시행일 {term.date}
              {term.version && ` · 버전 ${term.version}`}
            </p>
          </div>
          <span
            className={`rounded-badge px-[9px] py-[3px] text-caption font-bold ${
              term.required
                ? 'bg-primary-tint text-primary'
                : 'bg-surface-muted text-ink-hint'
            }`}
          >
            {term.required ? '필수' : '선택'}
          </span>
        </div>

        {/* 섹션 목록 */}
        <div className="flex flex-col gap-[22px]">
          {term.sections.map((section, idx) => (
            <SectionBlock key={idx} section={section} />
          ))}
        </div>
      </main>
    </div>
  )
}

export default TermsDetailPage
