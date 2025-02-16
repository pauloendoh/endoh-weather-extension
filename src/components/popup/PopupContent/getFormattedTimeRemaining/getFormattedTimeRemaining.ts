export const getFormattedTimeRemaining = (remainingMs: number) => {
  const minutes = Math.floor(remainingMs / 1000 / 60)
  const seconds = Math.floor((remainingMs / 1000) % 60)

  if (minutes === 0 && seconds === 0) {
    return ''
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
