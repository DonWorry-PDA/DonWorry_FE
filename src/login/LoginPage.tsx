import LoginForm from './components/LoginForm'

function LoginPage() {
  return (
    <div className="flex w-full flex-col px-6 pt-20">
      <h1 className="mb-2 text-heading font-bold text-ink">안녕하세요</h1>
      <p className="mb-10 text-body text-ink-sub">돈워리에 로그인해주세요</p>
      <LoginForm />
    </div>
  )
}

export default LoginPage
