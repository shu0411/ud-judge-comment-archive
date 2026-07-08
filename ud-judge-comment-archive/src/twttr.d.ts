export {}

declare global {
  interface Window {
    // index.html のブートストラップスニペットが window.twttr と ready() を用意し、
    // widgets は widgets.js のロード完了後に追加される
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement) => Promise<void>
      }
      ready: (callback: (twttr: NonNullable<Window['twttr']>) => void) => void
    }
  }
}
