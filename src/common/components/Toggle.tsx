import { useState } from 'react'

type ToggleSize = 'sm' | 'md'

type ToggleProps = {
  checked: boolean
  onChange: (checked: boolean) => void
  size?: ToggleSize
  'aria-label'?: string
}

const SIZE = {
  sm: { w: 44, h: 26, thumb: 22, pad: 2, stretch: 4 },
  md: { w: 50, h: 30, thumb: 24, pad: 3, stretch: 4 },
}

function Toggle({ checked, onChange, size = 'md', 'aria-label': ariaLabel }: ToggleProps) {
  const [pressed, setPressed] = useState(false)
  const { w, h, thumb, pad, stretch } = SIZE[size]

  const thumbWidth = pressed ? thumb + stretch : thumb
  const thumbLeft = checked ? w - pad - thumbWidth : pad

  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
      className={`relative shrink-0 rounded-full transition-colors duration-[250ms] ease-in-out ${
        checked ? 'bg-primary' : 'bg-[#d7dce5]'
      }`}
      style={{
        width: w,
        height: h,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'manipulation',
      }}
    >
      <span
        className="absolute left-0 rounded-full bg-white"
        style={{
          width: thumbWidth,
          height: thumb,
          top: pad,
          transform: `translateX(${thumbLeft}px)`,
          transition: pressed
            ? 'width 120ms ease-out'
            : 'transform 300ms cubic-bezier(0.34, 1.4, 0.64, 1), width 200ms ease-in',
          boxShadow: '0 2px 6px rgba(0,0,0,0.22), 0 0 1px rgba(0,0,0,0.08)',
        }}
      />
    </button>
  )
}

export default Toggle
