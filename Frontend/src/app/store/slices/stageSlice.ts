import { RootState } from '@/app/store'
import { IStage } from '@/global'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IStageSlice {
  value: IStage
}

const initialState: IStageSlice = {
  value: 'init',
}

export const stageSlice = createSlice({
  name: 'stage',
  initialState,
  reducers: {
    setStage: (state, action: PayloadAction<IStage>) => {
      state.value = action.payload
    },
  },
})

export const { setStage } = stageSlice.actions
export const selectStage = (state: RootState) => state.stage.value
export default stageSlice.reducer
