// 카탈로그(bank/securities)에 없는 기관은 이름으로 직접 매핑
export const NAME_LOGO_MAP: Record<string, string> = {
  // 연금
  '국민연금공단': '/logos/pension/nps.svg',
  // 카드
  'BC카드': '/logos/cards/bc-card.svg',
  '현대카드': '/logos/cards/hyundai-card.svg',
  '롯데카드': '/logos/cards/lotte-card.svg',
  '삼성카드': '/logos/cards/samsung-card.svg',
  '페이코': '/logos/cards/payco.svg',
}

export function getLogoByName(name: string): string | undefined {
  if (name.startsWith('신한')) return '/logos/sol-mark.svg'
  return NAME_LOGO_MAP[name]
}

const LOGO_MAP: Record<string, string> = {
  // 은행
  shinhan_bank: '/logos/sol-mark.svg',
  kb: '/logos/banks/kb-bank.svg',
  woori: '/logos/banks/woori-bank.svg',
  hana: '/logos/banks/hana-bank.svg',
  nh: '/logos/banks/nh-bank.svg',
  kakao: '/logos/banks/kakao-bank.svg',
  toss: '/logos/banks/toss-bank.svg',
  ibk: '/logos/banks/ibk-bank.svg',
  kdb: '/logos/banks/kdb-bank.svg',
  sc: '/logos/banks/sc-bank.svg',
  citi: '/logos/banks/citi-bank.svg',
  kbank: '/logos/banks/k-bank.svg',
  post: '/logos/banks/post-bank.svg',
  mg: '/logos/banks/mg-bank.svg',
  suhyup: '/logos/banks/suhyup-bank.svg',
  bnk: '/logos/banks/bnk-bank.svg',
  daegu: '/logos/banks/daegu-bank.svg',
  jb: '/logos/banks/jb-bank.svg',
  jeju: '/logos/banks/jeju-bank.svg',
  // 증권사
  shinhan_inv: '/logos/sol-mark.svg',
  samsung: '/logos/securities/samsung-securities.svg',
  mirae: '/logos/securities/mirae-securities.svg',
  korea_inv: '/logos/securities/kis-securities.svg',
  kiwoom: '/logos/securities/kiwoom-securities.svg',
  nh_inv: '/logos/securities/nh-bank.svg',
  hana_inv: '/logos/securities/hana-bank.svg',
  daishin: '/logos/securities/daishin-securities.svg',
  meritz: '/logos/securities/meritz-securities.svg',
  hanwha: '/logos/securities/hanwha-securities.svg',
  kyobo: '/logos/securities/kyobo-securities.svg',
  yuanta: '/logos/securities/yuanta-securities.svg',
  db: '/logos/securities/db-securities.svg',
  ebest: '/logos/securities/ebest-securities.svg',
  shinyoung: '/logos/securities/shinyoung-securities.svg',
  eugene: '/logos/securities/eugene-securities.svg',
  sk: '/logos/securities/sk-securities.svg',
  im: '/logos/securities/im-securities.svg',
  toss_inv: '/logos/securities/toss-bank.svg',
  woori_inv: '/logos/securities/woori-bank.svg',
  cape: '/logos/securities/cape-securities.svg',
  bookook: '/logos/securities/bookook-securities.svg',
}

export default LOGO_MAP
