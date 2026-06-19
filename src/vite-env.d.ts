/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

declare module '*.jpg' {
  const path: string
  export default path
}

declare module '*.png' {
  const path: string
  export default path
}
