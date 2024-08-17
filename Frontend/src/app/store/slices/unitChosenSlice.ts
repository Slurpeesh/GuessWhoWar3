import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IUnitChosenSlice {
  value: string
}

const initialState: IUnitChosenSlice = {
  value: '',
}

export const unitChosenSlice = createSlice({
  name: 'unitChosen',
  initialState,
  reducers: {
    setUnitChosen: (state, payload: PayloadAction<string>) => {
      state.value = payload.payload
    },
  },
})

export const { setUnitChosen } = unitChosenSlice.actions
export const selectUnitChosen = (state: RootState) => state.unitChosen.value
export default unitChosenSlice.reducer
