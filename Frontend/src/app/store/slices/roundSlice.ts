import { RootState } from '@/app/store'
import { IRound } from '@/global'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const isDev = process.env.NODE_ENV === 'development'

export interface IRoundSlice {
  value: IRound
}

const initialState: IRoundSlice = {
  value: {
    currentRound: 1,
    chosenUnit: '',
    timeLeft: isDev ? 5 : 20,
    started: false,
    soundUrl: null,
    rightAnswer: '',
  },
}

export const roundSlice = createSlice({
  name: 'round',
  initialState,
  reducers: {
    setRound: (state, action: PayloadAction<number>) => {
      state.value.currentRound = action.payload
    },
    setChosenUnit: (state, action: PayloadAction<string>) => {
      state.value.chosenUnit = action.payload
    },
    setTimeLeft: (state, action: PayloadAction<number>) => {
      state.value.timeLeft = action.payload
    },
    setRoundStarted: (state, action: PayloadAction<boolean>) => {
      state.value.started = action.payload
    },
    setRoundSound: (state, action: PayloadAction<string>) => {
      state.value.soundUrl = action.payload
    },
    setRightAnswer: (state, action: PayloadAction<string>) => {
      state.value.rightAnswer = action.payload
    },
    setRoundInit: (state) => {
      state.value = {
        currentRound: 1,
        chosenUnit: '',
        timeLeft: isDev ? 5 : 20,
        started: false,
        soundUrl: null,
        rightAnswer: '',
      }
    },
  },
})

export const {
  setRound,
  setChosenUnit,
  setTimeLeft,
  setRoundStarted,
  setRoundSound,
  setRightAnswer,
  setRoundInit,
} = roundSlice.actions
export const selectRound = (state: RootState) => state.round.value
export default roundSlice.reducer
