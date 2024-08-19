import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IPlayer {
  id: string
  name: string
  role: 'host' | 'player'
  points: number
}

export interface ILobbyPlayersSlice {
  value: Array<IPlayer>
}

const initialState: ILobbyPlayersSlice = {
  value: [],
}

export const lobbyPlayersSlice = createSlice({
  name: 'lobbyPlayers',
  initialState,
  reducers: {
    addPlayer: (state, payload: PayloadAction<IPlayer>) => {
      state.value.push(payload.payload)
    },
    setPlayers: (state, payload: PayloadAction<Array<IPlayer>>) => {
      state.value = payload.payload
    },
  },
})

export const { addPlayer, setPlayers } = lobbyPlayersSlice.actions
export const selectLobbyPlayers = (state: RootState) => state.lobbyPlayers.value
export default lobbyPlayersSlice.reducer
