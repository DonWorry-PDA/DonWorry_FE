import type { ButtonHTMLAttributes } from 'react'

type ButtonVariant = 'primary' | 'outline'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  fullWidth?: boolean
}

function Button({ variant = 'primary', fullWidth = true, className = '', children, ...props }: ButtonProps) {
  const base = 'h-[54px] rounded-btn text-btn font-bold transition-opacity disabled:opacity-40'
  const width = fullWidth ? 'w-full' : ''

  const variants: Record<ButtonVariant, string> = {
    primary: 'bg-primary text-white',
    outline: 'bg-white border border-line text-ink font-semibold',
  }

  return (
    <button type="button" className={`${base} ${width} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  )
}

export default Button
