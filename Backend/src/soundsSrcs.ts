import fs from 'fs'

export function getAudioFiles(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err)
      }

      const audioFiles = files.filter((file) => {
        return /\.(mp3|wav|ogg)$/i.test(file)
      })

      resolve(audioFiles)
    })
  })
}
