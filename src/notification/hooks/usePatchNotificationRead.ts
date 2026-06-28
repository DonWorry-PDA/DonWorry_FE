import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'

const usePatchNotificationRead = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (notificationId: number) =>
      client.patch(`/api/user/notifications/${notificationId}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
      queryClient.invalidateQueries({ queryKey: ['notificationUnreadCount'] })
    },
  })
}

export default usePatchNotificationRead
