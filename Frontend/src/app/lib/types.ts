import announceSounds from '@/app/lib/announceSounds'

// Извлечение типа ключей и значений из объекта
export type AnnounceSoundsType = typeof announceSounds

// Тип для ключей
export type AnnounceSoundKey = keyof AnnounceSoundsType
