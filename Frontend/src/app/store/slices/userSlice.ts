import { socket } from '@/app/socket'
import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IUser {
  id: string
  name: string
}

export interface IUserSlice {
  value: IUser
}

const initialState: IUserSlice = {
  value: { id: socket.id, name: 'Player' },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserName: (state, payload: PayloadAction<string>) => {
      state.value.name = payload.payload
    },
  },
})

export const { changeUserName } = userSlice.actions
export const selectUser = (state: RootState) => state.user.value
export default userSlice.reducer
