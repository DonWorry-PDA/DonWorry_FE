export const AUTH_FAILURE_EVENT = 'auth:failure'

export const dispatchAuthFailure = () =>
  window.dispatchEvent(new Event(AUTH_FAILURE_EVENT))
