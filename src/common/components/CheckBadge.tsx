import styles from './CheckAnimation.module.css'

function CheckBadge() {
  return (
    <div className="relative size-[5.25rem]">
      <svg viewBox="0 0 100 100" className="size-full overflow-visible" aria-hidden>
        <circle className={styles.ring} cx="50" cy="50" r="46" />
        <circle className={styles.disc} cx="50" cy="50" r="46" />
        <path className={styles.tick} d="M30 51 L44 66 L71 35" />
      </svg>
    </div>
  )
}

export default CheckBadge
