// 백엔드 linkTarget은 FE 라우트와 일치하지 않을 수 있어(예: "/report", "/monthly-salary")
// notificationType 기준으로 FE 라우트를 직접 고정한다.
const NOTIFICATION_ROUTES: Record<string, string> = {
  MONTHLY_REPORT: '/asset/monthly-report',
  MARKET_OPEN_REMINDER: '/home',
  BALANCE_ALERT: '/asset',
  PENSION_DEPOSIT: '/asset',
  DIVIDEND: '/asset',
}

function resolveNotificationRoute(notificationType?: string): string | undefined {
  if (!notificationType) return undefined
  return NOTIFICATION_ROUTES[notificationType]
}

export default resolveNotificationRoute
