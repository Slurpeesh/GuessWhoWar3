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
    addPlayer: (state, action: PayloadAction<IPlayer>) => {
      state.value.push(action.payload)
    },
    setPlayers: (state, action: PayloadAction<Array<IPlayer>>) => {
      state.value = action.payload
    },
    setNullifyPoints: (state) => {
      state.value.forEach((player) => (player.points = 0))
    },
  },
})

export const { addPlayer, setPlayers, setNullifyPoints } =
  lobbyPlayersSlice.actions
export const selectLobbyPlayers = (state: RootState) => state.lobbyPlayers.value
export default lobbyPlayersSlice.reducer
