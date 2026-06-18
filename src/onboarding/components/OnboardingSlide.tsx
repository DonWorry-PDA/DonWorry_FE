interface Props {
  title: string
  description: string
}

function OnboardingSlide({ title, description }: Props) {
  return (
    <div className="flex flex-col items-center gap-4 px-8 text-center">
      <div className="h-48 w-48 rounded-card-xl bg-primary-tint" />
      <h2 className="text-heading font-bold text-ink">{title}</h2>
      <p className="text-body text-ink-sub">{description}</p>
    </div>
  )
}

export default OnboardingSlide
