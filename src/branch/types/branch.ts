/** 영업점 운영 기관. 화면(은행/증권 탭)별로 이 값으로 조회한다. BE Institution enum과 일치. */
export type Institution = 'SHINHAN_BANK' | 'SHINHAN_SECURITIES'

/** 근처 영업점 조회 응답 항목. 거리는 BE에서 오름차순 정렬되어 내려온다. */
export type NearbyBranch = {
  id: number
  name: string
  address: string
  phone: string
  /** 광역 지역명. 은행 데이터엔 없어 null일 수 있다. */
  region: string | null
  distanceMeters: number
  distanceKm: number
}
