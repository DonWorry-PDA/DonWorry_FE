import { useMutation } from '@tanstack/react-query'
import client from '@/common/api/client'

const usePostLogout = () =>
  useMutation({
    mutationFn: () => client.post('/api/user/auth/logout'),
  })

export default usePostLogout
