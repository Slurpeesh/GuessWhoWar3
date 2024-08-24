import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const volume = Number(localStorage.getItem('volume')) ?? 0.5

export interface IVolumeSlice {
  value: number
}

const initialState: IVolumeSlice = {
  value: volume,
}

export const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    setVolume: (state, payload: PayloadAction<number>) => {
      state.value = payload.payload
      localStorage.setItem('volume', `${payload.payload}`)
    },
  },
})

export const { setVolume } = volumeSlice.actions
export const selectVolume = (state: RootState) => state.volume.value
export default volumeSlice.reducer
