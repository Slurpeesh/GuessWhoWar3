import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IError {
  isVisible: boolean
  text: string
}

interface IErrorSlice {
  value: IError
}

const initialState: IErrorSlice = {
  value: { isVisible: false, text: '' },
}

export const errorSlice = createSlice({
  name: 'error',
  initialState,
  reducers: {
    showError: (state, action: PayloadAction<string>) => {
      state.value.text = action.payload
      state.value.isVisible = true
    },
    hideError: (state) => {
      state.value.isVisible = false
    },
  },
})

export const { showError, hideError } = errorSlice.actions
export const selectError = (state: RootState) => state.error.value
export default errorSlice.reducer
