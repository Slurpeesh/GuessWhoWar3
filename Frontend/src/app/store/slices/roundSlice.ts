import { RootState } from '@/app/store'
import { IRound } from '@/global'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IRoundSlice {
  value: IRound
}

const initialState: IRoundSlice = {
  value: {
    currentRound: 1,
    chosenUnit: '',
    timeLeft: process.env.NODE_ENV === 'development' ? 5 : 20,
    started: false,
    soundUrl: null,
    rightAnswer: '',
  },
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
    setRoundStarted: (state, payload: PayloadAction<boolean>) => {
      state.value.started = payload.payload
    },
    setRoundSound: (state, payload: PayloadAction<string>) => {
      state.value.soundUrl = payload.payload
    },
    setRightAnswer: (state, payload: PayloadAction<string>) => {
      state.value.rightAnswer = payload.payload
    },
    setRoundInit: (state) => {
      state.value = {
        currentRound: 1,
        chosenUnit: '',
        timeLeft: 5,
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
