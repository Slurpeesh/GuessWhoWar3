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
    setVolume: (state, action: PayloadAction<number>) => {
      state.value = action.payload
      localStorage.setItem('volume', `${action.payload}`)
    },
  },
})

export const { setVolume } = volumeSlice.actions
export const selectVolume = (state: RootState) => state.volume.value
export default volumeSlice.reducer
