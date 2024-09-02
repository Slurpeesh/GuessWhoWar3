import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface IChatMobileModalSlice {
  value: boolean
}

const initialState: IChatMobileModalSlice = {
  value: false,
}

export const chatMobileModalSlice = createSlice({
  name: 'chatMobileModal',
  initialState,
  reducers: {
    setChatMobileModal: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload
    },
  },
})

export const { setChatMobileModal } = chatMobileModalSlice.actions
export const selectChatMobileModal = (state: RootState) =>
  state.chatMobileModal.value
export default chatMobileModalSlice.reducer
