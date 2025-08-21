/// <reference types="vite/client" />

// Extra image module declarations (fallback if vite/client types missed)
declare module '*.png' { const src: string; export default src; }
declare module '*.jpg' { const src: string; export default src; }
