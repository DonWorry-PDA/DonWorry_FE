import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'

interface PatchSettingRequest {
  id: string
  enabled: boolean
}

const usePatchNotificationSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, enabled }: PatchSettingRequest) =>
      client.patch(`/api/user/notifications/settings/${id}`, { enabled }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
    },
    onError: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
    },
  })
}

export default usePatchNotificationSetting
