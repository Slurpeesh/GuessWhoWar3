import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IVolumeSlice {
  value: number
}

const initialState: IVolumeSlice = {
  value: 0.5,
}

export const volumeSlice = createSlice({
  name: 'volume',
  initialState,
  reducers: {
    setVolume: (state, payload: PayloadAction<number>) => {
      state.value = payload.payload
    },
  },
})

export const { setVolume } = volumeSlice.actions
export const selectVolume = (state: RootState) => state.volume.value
export default volumeSlice.reducer
