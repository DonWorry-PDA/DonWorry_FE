import { useCallback, useEffect, useState } from 'react'

export type GeoStatus = 'prompting' | 'granted' | 'denied' | 'unavailable' | 'error'
export type Coords = { lat: number; lng: number }

const GEO_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 10000,
  maximumAge: 60000,
}

const geolocationSupported = () =>
  typeof navigator !== 'undefined' && 'geolocation' in navigator

/**
 * 브라우저 Geolocation으로 현재 좌표를 얻는다. 마운트 시 1회 자동 요청하며,
 * 권한 거부/미지원/실패는 상태로 구분해 화면에서 안내·재시도할 수 있게 한다.
 * (보안 컨텍스트 필요 — 배포 도메인은 HTTPS, 로컬은 localhost라 동작)
 */
export default function useGeolocation() {
  const [coords, setCoords] = useState<Coords | null>(null)
  // 미지원이면 시작부터 unavailable. 동기 setState를 effect 밖(초기화)으로 옮긴다.
  const [status, setStatus] = useState<GeoStatus>(() =>
    geolocationSupported() ? 'prompting' : 'unavailable',
  )

  // 상태 변경은 비동기 콜백 안에서만 일어나므로 effect에서 호출해도 안전하다.
  const runGeolocation = useCallback(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setStatus('granted')
      },
      (err) => {
        setStatus(err.code === err.PERMISSION_DENIED ? 'denied' : 'error')
      },
      GEO_OPTIONS,
    )
  }, [])

  // 이벤트 핸들러용 재시도. (effect가 아니므로 동기 setState 가능)
  const request = useCallback(() => {
    if (!geolocationSupported()) {
      setStatus('unavailable')
      return
    }
    setStatus('prompting')
    runGeolocation()
  }, [runGeolocation])

  useEffect(() => {
    if (geolocationSupported()) {
      runGeolocation()
    }
  }, [runGeolocation])

  return { coords, status, request }
}
