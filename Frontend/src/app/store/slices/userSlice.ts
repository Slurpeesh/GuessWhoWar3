import { RootState } from '@/app/store'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

const name = localStorage.getItem('name') ?? 'Player'

interface IUser {
  id: string
  name: string
  role: 'host' | 'player' | null
}

export interface IUserSlice {
  value: IUser
}

const initialState: IUserSlice = {
  value: { id: '', name, role: null },
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    changeUserName: (state, payload: PayloadAction<string>) => {
      state.value.name = payload.payload
      localStorage.setItem('name', payload.payload)
    },
    setUserId: (state, payload: PayloadAction<string>) => {
      state.value.id = payload.payload
    },
    setRole: (state, payload: PayloadAction<'host' | 'player'>) => {
      state.value.role = payload.payload
    },
  },
})

export const { changeUserName, setUserId, setRole } = userSlice.actions
export const selectUser = (state: RootState) => state.user.value
export default userSlice.reducer
