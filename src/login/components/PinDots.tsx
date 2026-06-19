interface Props {
  count: number
}

function PinDots({ count }: Props) {
  return (
    <div className="flex gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`size-3.5 rounded-full transition-colors duration-150 ${
            i < count ? 'bg-primary' : 'bg-dot-off'
          }`}
        />
      ))}
    </div>
  )
}

export default PinDots
