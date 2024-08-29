import fs from 'fs'
import path from 'path'
import { getAudioFiles } from './soundsSrcs'

// Мокаем fs
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
  },
}))

describe('getAudioFiles', () => {
  const mockReaddir = fs.promises.readdir as jest.Mock

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return a list of .aac files', async () => {
    const mockDir = '/mockDir'
    const mockFiles = [
      { name: 'file1.aac', isDirectory: () => false },
      { name: 'file2.txt', isDirectory: () => false },
      { name: 'subdir', isDirectory: () => true },
    ]
    const mockSubFiles = [
      { name: 'file3.aac', isDirectory: () => false },
      { name: 'file4.mp3', isDirectory: () => false },
    ]

    mockReaddir.mockImplementation((dirPath: string, options) => {
      if (dirPath === mockDir) {
        return Promise.resolve(mockFiles)
      } else if (dirPath === path.join(mockDir, 'subdir')) {
        return Promise.resolve(mockSubFiles)
      } else {
        return Promise.resolve([])
      }
    })

    const result = await getAudioFiles(mockDir)
    expect(result).toEqual(['file1.aac', path.join('subdir', 'file3.aac')])
  })

  it('should return an empty array if no .aac files are found', async () => {
    const mockDir = '/mockDir'
    const mockFiles = [
      { name: 'file1.txt', isDirectory: () => false },
      { name: 'subdir', isDirectory: () => true },
    ]
    const mockSubFiles = [{ name: 'file2.mp3', isDirectory: () => false }]

    mockReaddir.mockImplementation((dirPath: string, options) => {
      if (dirPath === mockDir) {
        return Promise.resolve(mockFiles)
      } else if (dirPath === path.join(mockDir, 'subdir')) {
        return Promise.resolve(mockSubFiles)
      } else {
        return Promise.resolve([])
      }
    })

    const result = await getAudioFiles(mockDir)
    expect(result).toEqual([])
  })
})
