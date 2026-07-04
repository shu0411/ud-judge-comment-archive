export {}

declare global {
  interface Window {
    twttr?: {
      widgets: {
        load: (element?: HTMLElement) => Promise<void>
      }
      ready?: (callback: (twttr: NonNullable<Window['twttr']>) => void) => void
    }
  }
}
