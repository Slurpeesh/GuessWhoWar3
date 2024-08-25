import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IMessage {
  senderId: string
  senderName: string
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
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.value.push(action.payload)
    },
    deleteMessages: (state) => {
      state.value = []
    },
  },
})

export const { addMessage, deleteMessages } = messagesSlice.actions
export const selectMessages = (state: RootState) => state.messages.value
export default messagesSlice.reducer
