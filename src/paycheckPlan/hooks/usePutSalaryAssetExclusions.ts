import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'
import { SalaryAssetExclusionRequest } from '../types/paycheckPlan'

const usePutSalaryAssetExclusions = () =>
  useMutation({
    mutationFn: (body: SalaryAssetExclusionRequest) =>
      client
        .put('/api/user/monthly-salary/assets/exclusions', body)
        .then((res) => res.data.data),
  })

export default usePutSalaryAssetExclusions
