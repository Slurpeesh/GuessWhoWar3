import { importAll } from './utils'

const imagesUnits = importAll(
  require.context('@public/assets/img/units/', false, /\.(png|jpe?g)$/)
)

export type ImagesBackground =
  | 'bg.png'
  | 'bgTwl.png'
  | 'bgUndead.png'
  | 'bgHorde.png'
  | 'bgNightElf.png'
  | 'bgAlliance.png'

const imagesBackground = importAll(
  require.context('@public/assets/img/bg/', false, /\.(png|jpe?g)$/)
) as Record<ImagesBackground, string>

const bgMainKey = 'bg.png'
const bgTwlKey = 'bgTwl.png'
let { [bgMainKey]: _bgMain, [bgTwlKey]: _bgTwl, ...bgLobby } = imagesBackground

const bgMain = imagesBackground['bg.png']
const bgTwl = imagesBackground['bgTwl.png']

export { bgLobby, bgMain, bgTwl, imagesUnits }
