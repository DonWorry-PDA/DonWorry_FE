// @vitest-environment jsdom
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import React from 'react'
import client from '@/common/api/client'
import useGetRetirementSimParams from '../useGetRetirementSimParams'

vi.mock('@/common/api/client', () => ({
  default: { get: vi.fn() },
}))

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  )
}

describe('useGetRetirementSimParams', () => {
  beforeEach(() => vi.clearAllMocks())

  it('서버 응답을 SimParams로 변환한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        code: 'SUCCESS',
        message: '',
        data: {
          ageYears: 63,
          totalAssetsKrw: 250_000_000,
          monthlyLivingKrw: 2_200_000,
          monthlyPensionKrw: 1_200_000,
        },
      },
    })

    const { result } = renderHook(() => useGetRetirementSimParams(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual({
      ageYears: 63,
      totalAssetsKrw: 250_000_000,
      monthlyLivingKrw: 2_200_000,
      monthlyPensionKrw: 1_200_000,
    })
  })

  it('ageYears가 null이면 0으로 변환한다', async () => {
    vi.mocked(client.get).mockResolvedValueOnce({
      data: {
        code: 'SUCCESS',
        message: '',
        data: {
          ageYears: null,
          totalAssetsKrw: 0,
          monthlyLivingKrw: 0,
          monthlyPensionKrw: 0,
        },
      },
    })

    const { result } = renderHook(() => useGetRetirementSimParams(), {
      wrapper: createWrapper(),
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data?.ageYears).toBe(0)
  })
})
