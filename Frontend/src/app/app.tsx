import Loader from '@/entities/Loader/Loader'
import { IGuesses, IPlayer, IRoomConfig, IStage } from '@/global'
import Dev from '@/pages/Dev/Dev'
import { CircleAlert } from 'lucide-react'
import { MutableRefObject, Suspense, useEffect, useRef } from 'react'
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
  setRound,
  setRoundSound,
  setRoundStarted,
} from './store/slices/roundSlice'
import { setStage } from './store/slices/stageSlice'
import { setUserId } from './store/slices/userSlice'

export default function App() {
  const error = useAppSelector((state) => state.error.value)
  const round = useAppSelector((state) => state.round.value)
  const currentRound: MutableRefObject<number> = useRef(round.currentRound)
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

    async function waitAction(timeout: number): Promise<void> {
      return new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          dispatch(setRightAnswer(''))
          resolve()
        }, timeout)
      })
    }

    async function onRoundEnd(
      rightAnswer: string,
      isGameEnded: boolean,
      guesses: Array<IGuesses>,
      clients: Array<IPlayer>
    ) {
      console.log(rightAnswer)
      console.log(isGameEnded)
      console.log(guesses)
      dispatch(setRightAnswer(rightAnswer))
      dispatch(setPlayers(clients))
      await waitAction(5000)
      console.log(isGameEnded)
      if (isGameEnded) {
        console.log('Game ended')
      } else {
        currentRound.current += 1
        dispatch(setRound(currentRound.current))
        console.log('Next round')
        socket.emit('getSoundForRound')
      }
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
    socket.on('roundEnd', onRoundEnd)

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
      socket.off('roundEnd', onRoundEnd)
    }
  }, [])

  return (
    <div className="w-dvw h-dvh flex bg-blue-500">
      {error.isVisible && (
        <div className="absolute z-50 top-5 right-5 flex items-center gap-2 bg-red-400 p-2 rounded-lg">
          <CircleAlert />
          <p className="font-semibold">{error.text}</p>
        </div>
      )}
      <Suspense fallback={<Loader className="w-32" />}>
        <Outlet />
      </Suspense>
      {process.env.NODE_ENV === 'development' && <Dev />}
    </div>
  )
}
