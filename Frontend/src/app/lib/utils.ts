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
  timeout: number
): Promise<void> {
  return new Promise<void>((resolve) => {
    const audTime = audio.duration * 1000

    setTimeout(() => {
      audio.play()
    }, timeout)

    setTimeout(() => {
      resolve()
    }, audTime + timeout)
  })
}
