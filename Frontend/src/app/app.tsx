import Loader from '@/entities/Loader/Loader'
import { IGuesses, IPlayer, IRoomConfig, IStage } from '@/global'
import Dev from '@/pages/Dev/Dev'
import { CircleAlert } from 'lucide-react'
import { MutableRefObject, Suspense, useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/useActions'
import announceSounds from './lib/announceSounds'
import { waitAndPlaySound } from './lib/utils'
import { socket } from './socket'
import { hideError, showError } from './store/slices/errorSlice'
import { setConnected } from './store/slices/isConnectedSlice'
import { setNullifyPoints, setPlayers } from './store/slices/lobbyPlayers'
import { addMessage } from './store/slices/messagesSlice'
import {
  setRoomId,
  setRoomMaxPlayers,
  setRoomRounds,
} from './store/slices/roomConfigSlice'
import {
  setRightAnswer,
  setRound,
  setRoundInit,
  setRoundSound,
  setRoundStarted,
} from './store/slices/roundSlice'
import { setStage } from './store/slices/stageSlice'
import { setUserId } from './store/slices/userSlice'

const endAud = new Audio(announceSounds['end.mp3'])
const dissapointEndAud = new Audio(announceSounds['dissapointEnd.mp3'])

export default function App() {
  const error = useAppSelector((state) => state.error.value)
  const round = useAppSelector((state) => state.round.value)
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)
  const currentRound: MutableRefObject<number> = useRef(round.currentRound)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    let soundForRoundController: AbortController
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
        soundForRoundController.abort()
        dispatch(setStage('init'))
        dispatch(setRoundInit())
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

    //FIXME: need abort controller
    async function onSoundForRound(sound: Buffer) {
      soundForRoundController = new AbortController()
      const signal = soundForRoundController.signal
      const audioBlob = new Blob([sound], { type: 'audio/mp3' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      try {
        await waitAndPlaySound(audio, 2000, signal)
        console.log('notAborted')
        dispatch(setRoundSound(audioUrl))
        dispatch(setRoundStarted(true))
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error)
        } else {
          console.log('Aborted sound')
        }
      }
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
      let isDissapointed: boolean = true
      clients.forEach((client) => {
        if (client.points > 0) {
          isDissapointed = false
        }
      })
      dispatch(setRightAnswer(rightAnswer))
      dispatch(setPlayers(clients))
      await waitAction(5000)
      if (isGameEnded) {
        dispatch(setStage('results'))
        dispatch(setRound(1))
        if (isDissapointed) {
          await waitAndPlaySound(dissapointEndAud, 1000)
        } else {
          await waitAndPlaySound(endAud, 1000)
        }
      } else {
        currentRound.current += 1
        dispatch(setRound(currentRound.current))
        socket.emit('getSoundForRound')
      }
    }

    function onTransferToLobby() {
      dispatch(setNullifyPoints())
      dispatch(setStage('lobby'))
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
    socket.on('transferToLobby', onTransferToLobby)

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
      socket.off('transferToLobby', onTransferToLobby)
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
