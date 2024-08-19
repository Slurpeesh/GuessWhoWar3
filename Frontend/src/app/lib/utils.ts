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
  timeout: number = 0
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      audio.play().catch(reject)
      audio.onended = () => {
        resolve()
      }
      audio.onerror = (error) => {
        reject(error)
      }
    }, timeout)
  })
}
