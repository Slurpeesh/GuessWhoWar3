import chatMobileModalReducer from '@/app/store/slices/chatMobileModalSlice'
import deviceReducer from '@/app/store/slices/deviceSlice'
import errorReducer from '@/app/store/slices/errorSlice'
import isConnectedReducer from '@/app/store/slices/isConnectedSlice'
import messagesReducer from '@/app/store/slices/messagesSlice'
import roomConfigReducer from '@/app/store/slices/roomConfigSlice'
import roundReducer from '@/app/store/slices/roundSlice'
import stageReducer from '@/app/store/slices/stageSlice'
import themeReducer from '@/app/store/slices/themeSlice'
import userReducer from '@/app/store/slices/userSlice'
import volumeReducer from '@/app/store/slices/volumeSlice'
import { configureStore } from '@reduxjs/toolkit'
import lobbyPlayersReducer from './slices/lobbyPlayers'

export const store = configureStore({
  reducer: {
    isConnected: isConnectedReducer,
    messages: messagesReducer,
    user: userReducer,
    roomConfig: roomConfigReducer,
    lobbyPlayers: lobbyPlayersReducer,
    error: errorReducer,
    stage: stageReducer,
    round: roundReducer,
    volume: volumeReducer,
    theme: themeReducer,
    device: deviceReducer,
    chatMobileModal: chatMobileModalReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
