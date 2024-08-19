import fs from 'fs'
import path from 'path'

export async function getAudioFiles(dir: string): Promise<string[]> {
  let audioFiles: string[] = []

  async function readDirRecursively(currentDir: string) {
    const files = await fs.promises.readdir(currentDir, { withFileTypes: true })

    for (const file of files) {
      const filePath = path.join(currentDir, file.name)
      if (file.isDirectory()) {
        await readDirRecursively(filePath)
      } else if (/\.mp3$/i.test(file.name)) {
        const relativeFilePath = path.relative(dir, filePath)
        audioFiles.push(relativeFilePath)
      }
    }
  }

  await readDirRecursively(dir)

  return audioFiles
}
