import { MOCK_USER_PROFILE } from '../../mypage/mock/mypage'
import type { UserProfile } from '../../mypage/types/mypage'

// Replace MOCK_USER_PROFILE with real session/API data when auth is implemented
function useCurrentUser(): UserProfile {
  return MOCK_USER_PROFILE
}

export default useCurrentUser
