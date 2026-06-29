import { describe, expect, it } from 'vitest'
import { formatDistance } from '../utils/formatDistance'

describe('formatDistance', () => {
  it('1km 미만은 미터로 표시한다', () => {
    expect(formatDistance(320)).toBe('320m')
    expect(formatDistance(999)).toBe('999m')
  })

  it('1km 이상은 소수 첫째 자리 km로 표시한다', () => {
    expect(formatDistance(1000)).toBe('1.0km')
    expect(formatDistance(1234)).toBe('1.2km')
    expect(formatDistance(35333)).toBe('35.3km')
  })

  it('미터는 반올림 정수로 표시한다', () => {
    expect(formatDistance(319.6)).toBe('320m')
  })
})
