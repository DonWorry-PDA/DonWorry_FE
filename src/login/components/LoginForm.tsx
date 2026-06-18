function LoginForm() {
  return (
    <div className="flex flex-col gap-3">
      <input
        type="text"
        placeholder="아이디"
        className="w-full rounded-btn bg-surface px-4 py-3 text-md text-ink placeholder:text-ink-hint"
      />
      <input
        type="password"
        placeholder="비밀번호"
        className="w-full rounded-btn bg-surface px-4 py-3 text-md text-ink placeholder:text-ink-hint"
      />
      <button className="mt-2 w-full rounded-btn bg-primary py-4 text-btn font-bold text-white">
        로그인
      </button>
    </div>
  )
}

export default LoginForm
