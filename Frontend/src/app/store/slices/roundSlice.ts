import { RootState } from '@/app/store'
import { IRound } from '@/global'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IRoundSlice {
  value: IRound
}

const initialState: IRoundSlice = {
  value: { currentRound: 1, chosenUnit: '', timeLeft: 15 },
}

export const roundSlice = createSlice({
  name: 'round',
  initialState,
  reducers: {
    setRound: (state, payload: PayloadAction<number>) => {
      state.value.currentRound = payload.payload
    },
    setChosenUnit: (state, payload: PayloadAction<string>) => {
      state.value.chosenUnit = payload.payload
    },
    setTimeLeft: (state, payload: PayloadAction<number>) => {
      state.value.timeLeft = payload.payload
    },
  },
})

export const { setRound, setChosenUnit, setTimeLeft } = roundSlice.actions
export const selectRound = (state: RootState) => state.round.value
export default roundSlice.reducer
