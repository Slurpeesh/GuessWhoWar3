import { importAll } from './utils'

const imagesUnits = importAll(
  require.context('@public/assets/img/units/', false, /\.(png|jpe?g)$/)
)

export type ImagesBackground =
  | 'bg.png'
  | 'bgUndead.png'
  | 'bgHorde.png'
  | 'bgNightElf.png'
  | 'bgAlliance.png'

const imagesBackground = importAll(
  require.context('@public/assets/img/bg/', false, /\.(png|jpe?g)$/)
) as Record<ImagesBackground, string>

const dynamicKey = 'bg.png'
let { [dynamicKey]: _, ...bgLobby } = imagesBackground

const bgMain = imagesBackground['bg.png']

export { bgLobby, bgMain, imagesUnits }
