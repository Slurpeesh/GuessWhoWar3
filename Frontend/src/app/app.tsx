import Loader from '@/entities/Loader/Loader'
import { IPlayer, IRoomConfig, IStage } from '@/global'
import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/useActions'
import { socket } from './socket'
import { hideError, showError } from './store/slices/errorSlice'
import { setConnected } from './store/slices/isConnectedSlice'
import { setPlayers } from './store/slices/lobbyPlayers'
import { addMessage } from './store/slices/messagesSlice'
import {
  setRoomId,
  setRoomMaxPlayers,
  setRoomRounds,
} from './store/slices/roomConfigSlice'
import { setStage } from './store/slices/stageSlice'
import { setUserId } from './store/slices/userSlice'

export default function App() {
  const error = useAppSelector((state) => state.error.value)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    function onConnect() {
      dispatch(setConnected(true))
      dispatch(setUserId(socket.id))
    }

    function onDisconnect() {
      dispatch(setConnected(false))
    }

    function onMessage(value: string) {
      console.log(value)
      dispatch(addMessage({ value }))
    }

    function onPlayerData(players: Array<IPlayer>) {
      dispatch(setPlayers(players))
      if (players.length === 0) {
        dispatch(setStage('init'))
        navigate('/')
      }
    }

    function onStageConfirm(stage: IStage) {
      dispatch(setStage(stage))
      if (stage === 'lobby') {
        navigate('/lobby')
      } else {
        navigate('/')
      }
    }

    function onRoomExists() {
      dispatch(showError('Room already exists'))
      setTimeout(() => {
        dispatch(hideError())
      }, 2000)
    }

    function onNoSuchRoom() {
      dispatch(showError('No such room'))
      setTimeout(() => {
        dispatch(hideError())
      }, 2000)
    }

    function onRoomIsFull() {
      dispatch(showError('Room is full'))
      setTimeout(() => {
        dispatch(hideError())
      }, 2000)
    }

    function onRoomConfig({ id, maxPlayers, rounds }: IRoomConfig) {
      dispatch(setRoomId(id))
      dispatch(setRoomRounds(rounds))
      dispatch(setRoomMaxPlayers(maxPlayers))
    }

    function onGameStarted() {
      dispatch(setStage('game'))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('message', onMessage)
    socket.on('playerData', onPlayerData)
    socket.on('stageConfirm', onStageConfirm)
    socket.on('roomExists', onRoomExists)
    socket.on('noSuchRoom', onNoSuchRoom)
    socket.on('roomIsFull', onRoomIsFull)
    socket.on('roomConfig', onRoomConfig)
    socket.on('gameStarted', onGameStarted)

    socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('message', onMessage)
      socket.off('playerData', onPlayerData)
      socket.off('stageConfirm', onStageConfirm)
      socket.off('roomExists', onRoomExists)
      socket.off('noSuchRoom', onNoSuchRoom)
      socket.off('roomIsFull', onRoomIsFull)
      socket.off('gameStarted', onGameStarted)
    }
  }, [])

  return (
    <div className="w-dvw h-dvh flex bg-blue-500">
      {error.isVisible && (
        <div className="absolute z-50 top-5 right-5 bg-red-400 p-2 rounded-lg">
          {error.text}
        </div>
      )}
      <Suspense fallback={<Loader className="w-32" />}>
        <Outlet />
      </Suspense>
    </div>
  )
}
