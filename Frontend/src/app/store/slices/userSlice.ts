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
    changeUserName: (state, action: PayloadAction<string>) => {
      state.value.name = action.payload
      localStorage.setItem('name', action.payload)
    },
    setUserId: (state, action: PayloadAction<string>) => {
      state.value.id = action.payload
    },
    setRole: (state, action: PayloadAction<'host' | 'player'>) => {
      state.value.role = action.payload
    },
  },
})

export const { changeUserName, setUserId, setRole } = userSlice.actions
export const selectUser = (state: RootState) => state.user.value
export default userSlice.reducer
