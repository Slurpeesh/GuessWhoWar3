import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function importAll(r: __WebpackModuleApi.RequireContext): {
  [key: string]: string
} {
  let assets: { [key: string]: string } = {}
  r.keys().forEach((item) => {
    assets[item.replace('./', '')] = r(item)
  })
  return assets
}

export function waitAndPlaySound(
  audio: HTMLAudioElement,
  timeout: number = 0,
  signal?: AbortSignal
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const timer = setTimeout(() => {
      audio.play().catch(reject)

      const onEnded = () => {
        clearListeners()
        resolve()
      }

      const onError = (error: Event) => {
        clearListeners()
        reject(error)
      }

      const clearListeners = () => {
        audio.onended = null
        audio.onerror = null
        signal?.removeEventListener('abort', onAbort)
      }

      const onAbort = () => {
        clearListeners()
        audio.pause()
        audio.currentTime = 0
        reject(new DOMException('Aborted', 'AbortError'))
      }

      audio.onended = onEnded
      audio.onerror = onError

      if (signal) {
        signal.addEventListener('abort', onAbort)
      }
    }, timeout)

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
      })
    }
  })
}
