interface Props {
  count: number
  isLoading?: boolean
  isShaking?: boolean
}

function PinDots({ count, isLoading = false, isShaking = false }: Props) {
  const displayCount = isShaking ? 6 : count

  return (
    <div className={`flex w-full items-center justify-between px-10 ${isShaking ? 'animate-pin-shake' : ''}`}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex size-6 items-center justify-center">
          {i < displayCount ? (
            <div
              className={`rounded-full transition-all duration-150 ${
                isLoading
                  ? 'motion-safe:animate-bounce size-4 bg-primary'
                  : 'size-3.5 bg-primary'
              }`}
              style={isLoading ? { animationDelay: `${i * 60}ms`, animationDuration: '0.6s' } : undefined}
            />
          ) : (
            <div className="h-0.5 w-full rounded-full bg-disabled" />
          )}
        </div>
      ))}
    </div>
  )
}

export default PinDots
