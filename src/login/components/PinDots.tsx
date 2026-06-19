interface Props {
  count: number
}

function PinDots({ count }: Props) {
  return (
    <div className="flex w-full items-center justify-between px-10">
      {Array.from({ length: 6 }).map((_, i) =>
        i < count ? (
          <div key={i} className="size-3.5 rounded-full bg-primary transition-colors duration-150" />
        ) : (
          <div key={i} className="h-0.5 w-6 rounded-full bg-disabled" />
        ),
      )}
    </div>
  )
}

export default PinDots
