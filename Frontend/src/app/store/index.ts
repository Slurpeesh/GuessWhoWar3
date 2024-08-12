import isConnectedReducer from '@/app/store/slices/isConnectedSlice'
import messagesReducer from '@/app/store/slices/messagesSlice'
import roomConfigReducer from '@/app/store/slices/roomConfigSlice'
import userReducer from '@/app/store/slices/userSlice'
import { configureStore } from '@reduxjs/toolkit'
import lobbyPlayersReducer from './slices/lobbyPlayers'

export const store = configureStore({
  reducer: {
    isConnected: isConnectedReducer,
    messages: messagesReducer,
    user: userReducer,
    roomConfig: roomConfigReducer,
    lobbyPlayers: lobbyPlayersReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
