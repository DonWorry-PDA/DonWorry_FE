interface Props {
  count: number
  isLoading?: boolean
}

function PinDots({ count, isLoading = false }: Props) {
  return (
    <div className="flex w-full items-center justify-between px-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex size-6 items-center justify-center">
          {i < count ? (
            <div
              className={`rounded-full bg-primary transition-all duration-150 ${isLoading ? 'animate-bounce size-4' : 'size-3.5'}`}
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
