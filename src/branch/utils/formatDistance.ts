/**
 * 거리 표시 포맷. 1km 미만은 미터(예: 800m), 이상은 소수 첫째 자리 km(예: 1.2km).
 * BE의 km 환산과 동일하게 100m 단위 반올림으로 소수 한 자리를 만든다.
 */
export function formatDistance(distanceMeters: number): string {
  // 단위 결정은 반올림된 미터값 기준으로 한다 — 999.5m가 "1000m"가 아니라 "1.0km"로 넘어가도록.
  const meters = Math.round(distanceMeters)
  if (meters < 1000) {
    return `${meters}m`
  }
  const km = Math.round(distanceMeters / 100) / 10
  return `${km.toFixed(1)}km`
}
