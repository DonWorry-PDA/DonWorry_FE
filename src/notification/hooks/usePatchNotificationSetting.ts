import { useMutation, useQueryClient } from '@tanstack/react-query'
import client from '@/common/api/client'
import type { NotificationSetting } from '../types/notification'

interface PatchSettingRequest {
  id: string
  enabled: boolean
}

const usePatchNotificationSetting = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, enabled }: PatchSettingRequest) =>
      client.patch(`/api/user/notifications/settings/${id}`, { enabled }),
    onMutate: async ({ id, enabled }) => {
      await queryClient.cancelQueries({ queryKey: ['notificationSettings'] })
      const previous = queryClient.getQueryData<NotificationSetting[]>(['notificationSettings'])
      queryClient.setQueryData<NotificationSetting[]>(
        ['notificationSettings'],
        (old) => old?.map((s) => (s.id === id ? { ...s, enabled } : s)) ?? old,
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous !== undefined) {
        queryClient.setQueryData(['notificationSettings'], context.previous)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationSettings'] })
    },
  })
}

export default usePatchNotificationSetting
