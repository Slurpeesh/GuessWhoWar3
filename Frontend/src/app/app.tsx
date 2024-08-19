import Loader from '@/entities/Loader/Loader'
import { IPlayer, IRoomConfig, IStage } from '@/global'
import Dev from '@/pages/Dev/Dev'
import { Suspense, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/useActions'
import { waitAndPlaySound } from './lib/utils'
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
import {
  setRightAnswer,
  setRoundSound,
  setRoundStarted,
} from './store/slices/roundSlice'
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

    function onGameAlreadyStarted() {
      dispatch(showError('Game already started'))
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

    async function onSoundForRound(sound: Buffer) {
      const audioBlob = new Blob([sound], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      await waitAndPlaySound(audio, 2000)
      dispatch(setRoundSound(audioUrl))
      dispatch(setRoundStarted(true))
    }

    function onShowAnswer(rightAnswer: string) {
      console.log(rightAnswer)
      dispatch(setRightAnswer(rightAnswer))
      setTimeout(() => {
        dispatch(setRightAnswer(''))
      }, 5000)
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('message', onMessage)
    socket.on('playerData', onPlayerData)
    socket.on('stageConfirm', onStageConfirm)
    socket.on('roomExists', onRoomExists)
    socket.on('noSuchRoom', onNoSuchRoom)
    socket.on('gameAlreadyStarted', onGameAlreadyStarted)
    socket.on('roomIsFull', onRoomIsFull)
    socket.on('roomConfig', onRoomConfig)
    socket.on('gameStarted', onGameStarted)
    socket.on('soundForRound', onSoundForRound)
    socket.on('showAnswer', onShowAnswer)

    socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('message', onMessage)
      socket.off('playerData', onPlayerData)
      socket.off('stageConfirm', onStageConfirm)
      socket.off('roomExists', onRoomExists)
      socket.off('noSuchRoom', onNoSuchRoom)
      socket.off('gameAlreadyStarted', onGameAlreadyStarted)
      socket.off('roomIsFull', onRoomIsFull)
      socket.off('roomConfig', onRoomConfig)
      socket.off('gameStarted', onGameStarted)
      socket.off('soundForRound', onSoundForRound)
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
      {process.env.NODE_ENV === 'development' && <Dev />}
    </div>
  )
}
