import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IMessage {
  value: string
}

export interface IMessagesSlice {
  value: Array<IMessage>
}

const initialState: IMessagesSlice = {
  value: [],
}

export const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessage: (state, payload: PayloadAction<IMessage>) => {
      state.value.push(payload.payload)
    },
  },
})

export const { addMessage } = messagesSlice.actions
export const selectMessages = (state: RootState) => state.messages.value
export default messagesSlice.reducer
