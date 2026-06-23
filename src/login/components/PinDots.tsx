interface Props {
  count: number
}

function PinDots({ count }: Props) {
  return (
    <div className="flex w-full items-center justify-between px-10">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex size-6 items-center justify-center">
          {i < count ? (
            <div className="size-3.5 rounded-full bg-primary transition-colors duration-150" />
          ) : (
            <div className="h-0.5 w-full rounded-full bg-disabled" />
          )}
        </div>
      ))}
    </div>
  )
}

export default PinDots
