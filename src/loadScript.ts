export function loadScript(src: string, id: string) {
  return new Promise((resolve, reject) => {
    const existingScript = document.getElementById(id)
    if (!existingScript) {
      let s
      s = document.createElement('script')
      s.src = src
      s.id = id
      s.onload = resolve
      s.onerror = reject
      s.async = true
      document.head.appendChild(s)
    } else {
      resolve()
    }
  })
}
