import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IMessage {
  senderId: string
  senderName: string
  value: string
  isSeen: boolean
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
    setAllSeen: (state) => {
      state.value.forEach((value) => (value.isSeen = true))
    },
  },
})

export const { addMessage, deleteMessages, setAllSeen } = messagesSlice.actions
export const selectMessages = (state: RootState) => state.messages.value
export default messagesSlice.reducer
