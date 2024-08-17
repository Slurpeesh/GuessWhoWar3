import { importAll } from './utils'

type AnnounceSounds =
  | 'end.mp3'
  | 'introSpeech.mp3'
  | 'roundStart.mp3'
  | 'timesUp.mp3'

const announceSounds = importAll(
  require.context('@public/assets/sound/', false, /\.(mp3)$/)
) as Record<AnnounceSounds, string>

export default announceSounds
