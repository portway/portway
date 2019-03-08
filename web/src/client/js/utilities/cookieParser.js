export const getCookieValue = (name) => {
  const match = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`)
  return match ? match.pop() : null
}
