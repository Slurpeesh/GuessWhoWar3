import {
  areClientsSynced,
  setClientsUnsynced,
  setClientSynced,
} from './syncRoom'
import type { IPlayer } from './types'

describe('syncRoom', () => {
  let testCaseFull: Array<IPlayer>
  let testCaseEmpty: Array<IPlayer>
  beforeEach(() => {
    testCaseFull = [
      {
        id: 'gfdgsgdsgs123fs',
        name: 'Player1',
        role: 'host',
        isSynced: false,
        points: 1,
      },
      {
        id: '124hhsfhdsfdsg',
        name: 'Player2',
        role: 'player',
        isSynced: true,
        points: 10,
      },
      {
        id: 'lmlkm411m2lk411',
        name: 'Player3',
        role: 'player',
        isSynced: true,
        points: 0,
      },
    ]
    testCaseEmpty = []
  })

  test('setClientsUnsynced', () => {
    setClientsUnsynced(testCaseFull)
    expect(
      testCaseFull.filter((client) => client.isSynced === false).length
    ).toBe(testCaseFull.length)
    setClientsUnsynced(testCaseEmpty)
    expect(
      testCaseEmpty.filter((client) => client.isSynced === false).length
    ).toBe(testCaseEmpty.length)
  })

  test('setClientSynced', () => {
    setClientSynced(testCaseFull[0])
    expect(testCaseFull[0].isSynced).toBe(true)
    setClientSynced(testCaseFull[1])
    expect(testCaseFull[1].isSynced).toBe(true)
  })

  test('areClientsSynced', () => {
    expect(areClientsSynced(testCaseFull)).toBe(false)
    expect(areClientsSynced(testCaseEmpty)).toBe(true)
    for (const client of testCaseFull) {
      client.isSynced = true
    }
    expect(areClientsSynced(testCaseFull)).toBe(true)
    for (const client of testCaseEmpty) {
      client.isSynced = true
    }
    expect(areClientsSynced(testCaseEmpty)).toBe(true)
  })
})
