import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'

const usePatchNotificationsReadAll = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => client.patch('/api/user/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
  })
}

export default usePatchNotificationsReadAll
