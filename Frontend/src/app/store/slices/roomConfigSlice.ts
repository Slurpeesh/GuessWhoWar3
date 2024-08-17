import { RootState } from '@/app/store'
import { IRoomConfig } from '@/global'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IRoomConfigSlice {
  value: IRoomConfig
}

const initialState: IRoomConfigSlice = {
  value: { id: Date.now().toString(), rounds: 1, maxPlayers: 1 },
}

export const roomConfigSlice = createSlice({
  name: 'roomConfig',
  initialState,
  reducers: {
    setRoomId: (state, payload: PayloadAction<string>) => {
      state.value.id = payload.payload
    },
    setRoomRounds: (state, payload: PayloadAction<number>) => {
      state.value.rounds = payload.payload
    },
    setRoomMaxPlayers: (state, payload: PayloadAction<number>) => {
      state.value.maxPlayers = payload.payload
    },
  },
})

export const { setRoomId, setRoomRounds, setRoomMaxPlayers } =
  roomConfigSlice.actions
export const selectRoomConfig = (state: RootState) => state.roomConfig.value
export default roomConfigSlice.reducer
