import { importAll } from './utils'

const images = importAll(
  require.context('@public/assets/img/', false, /\.(png|jpe?g)$/)
)

export default images
