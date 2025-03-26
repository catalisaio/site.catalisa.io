/// <reference types="vite/client" />

// Declare media file modules
declare module '*.mp3' {
  const src: string;
  export default src;
}

declare module '*.srt' {
  const src: string;
  export default src;
}
