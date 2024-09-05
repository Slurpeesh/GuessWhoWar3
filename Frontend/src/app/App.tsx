import Loader from '@/entities/Loader/Loader'
import SoundVolumeSlider from '@/features/SoundVolumeSlider/SoundVolumeSlider'
import ThemeButton from '@/features/ThemeButton/ThemeButton'
import { IGuesses, IPlayer, IRoomConfig, IStage } from '@/global'
import { CircleAlert } from 'lucide-react'
import { MutableRefObject, Suspense, useEffect, useRef } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from './hooks/useActions'
import announceSounds from './lib/announceSounds'
import { cn, waitAndPlaySound } from './lib/utils'
import { socket } from './socket'
import {
  defineDevice,
  mediaDeviceQueriesList,
  setDevice,
} from './store/slices/deviceSlice'
import { hideError, showError } from './store/slices/errorSlice'
import { setConnected } from './store/slices/isConnectedSlice'
import { setNullifyPoints, setPlayers } from './store/slices/lobbyPlayers'
import { addMessage, deleteMessages } from './store/slices/messagesSlice'
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
  const volume = useAppSelector((state) => state.volume.value)
  const round = useAppSelector((state) => state.round.value)
  const device = useAppSelector((state) => state.device.value)
  const isConnected = useAppSelector((state) => state.isConnected.value)
  const chatMobileModal = useAppSelector((state) => state.chatMobileModal.value)
  const currentRound: MutableRefObject<number> = useRef(round.currentRound)
  const audioForRoundRef: MutableRefObject<HTMLAudioElement> = useRef(null)
  const endAudRef: MutableRefObject<HTMLAudioElement> = useRef(endAud)
  const dissapointEndAudRef: MutableRefObject<HTMLAudioElement> =
    useRef(dissapointEndAud)
  const volumeRef: MutableRefObject<number> = useRef(volume)
  const scrollAreaRef: MutableRefObject<HTMLDivElement> = useRef(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    volumeRef.current = volume
    endAudRef.current.volume = volume
    dissapointEndAudRef.current.volume = volume
    if (audioForRoundRef.current !== null) {
      audioForRoundRef.current.volume = volume
    }
  }, [volume])

  useEffect(() => {
    const handler = () => {
      const matches = mediaDeviceQueriesList.map((query) => query.matches)
      dispatch(setDevice(defineDevice(matches)))
    }
    mediaDeviceQueriesList.forEach((query, index) => {
      if (index !== 1) {
        query.addEventListener('change', handler)
      }
    })
    let soundForRoundController: AbortController = null
    let endSoundController: AbortController = null
    function onConnect() {
      dispatch(setConnected(true))
      dispatch(setUserId(socket.id))
    }

    function onDisconnect() {
      dispatch(setConnected(false))
    }

    function onMessage(value: string, senderId: string, senderName: string) {
      dispatch(
        addMessage({ value, senderId, senderName, isSeen: chatMobileModal })
      )
      if (scrollAreaRef.current) {
        const isAtBottom =
          Math.abs(
            scrollAreaRef.current.scrollHeight -
              scrollAreaRef.current.scrollTop -
              scrollAreaRef.current.clientHeight
          ) < 60
        if (isAtBottom || senderId === socket.id) {
          setTimeout(() => {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
          })
        }
      }
    }

    function onPlayerData(players: Array<IPlayer>) {
      dispatch(setPlayers(players))
      if (players.length === 0) {
        if (soundForRoundController !== null) {
          soundForRoundController.abort()
        }
        if (endSoundController !== null) {
          endSoundController.abort()
        }
        dispatch(setStage('init'))
        dispatch(setRoundInit())
        dispatch(deleteMessages())
        currentRound.current = 1
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
      soundForRoundController = new AbortController()
      const signal = soundForRoundController.signal
      const audioBlob = new Blob([sound], { type: 'audio/aac' })
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audioForRoundRef.current = audio
      audio.volume = volumeRef.current
      try {
        await waitAndPlaySound(audio, 2000, signal)
        dispatch(setRoundSound(audioUrl))
        dispatch(setRoundStarted(true))
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error(error)
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
      // console.log(rightAnswer)
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
        endSoundController = new AbortController()
        const signal = endSoundController.signal
        try {
          if (isDissapointed) {
            dissapointEndAudRef.current.volume = volumeRef.current
            await waitAndPlaySound(dissapointEndAudRef.current, 1000, signal)
          } else {
            endAudRef.current.volume = volumeRef.current
            await waitAndPlaySound(endAudRef.current, 1000, signal)
          }
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error(error)
          }
        }
      } else {
        currentRound.current += 1
        dispatch(setRound(currentRound.current))
        socket.emit('getSoundForRound')
      }
    }

    function onTransferToLobby() {
      if (endSoundController !== null) {
        endSoundController.abort()
      }
      dispatch(setNullifyPoints())
      dispatch(setRoundInit())
      currentRound.current = 1
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
      mediaDeviceQueriesList.forEach((query) => {
        query.removeEventListener('change', handler)
      })
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
    <div className="w-dvw h-dvh flex flex-col md:flex-row text-foreground bg-background">
      {error.isVisible && (
        <div className="absolute z-50 top-5 right-5 flex items-center gap-2 bg-danger p-2 rounded-lg">
          <CircleAlert />
          <p className="font-semibold">{error.text}</p>
        </div>
      )}
      <Suspense
        fallback={
          <div className="absolute z-50 top-0 left-0 w-dvw h-dvh flex justify-center items-center">
            <Loader className="w-32" />
          </div>
        }
      >
        <Outlet context={scrollAreaRef} />
      </Suspense>
      {/* {process.env.NODE_ENV === 'development' && <Dev />} */}
      {device !== 'mobile' && (
        <SoundVolumeSlider className="absolute bottom-5 right-5 w-40 md:w-60" />
      )}
      <ThemeButton
        className={cn('fixed z-40 bottom-14 right-3', {
          'bottom-3': device === 'mobile',
        })}
      />
      {!isConnected && (
        <div className="absolute z-50 top-0 left-0 w-dvw h-dvh bg-muted/80 flex flex-col gap-5 justify-center items-center">
          <Loader />
          <p className="text-xl">Connecting...</p>
        </div>
      )}
    </div>
  )
}
