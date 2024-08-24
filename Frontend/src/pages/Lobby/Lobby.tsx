import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import announceSounds from '@/app/lib/announceSounds'
import { bgLobby } from '@/app/lib/imgs'
import { waitAndPlaySound } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import {
  setChosenUnit,
  setRoundStarted,
  setTimeLeft,
} from '@/app/store/slices/roundSlice'
import { setRole } from '@/app/store/slices/userSlice'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/Tooltip/Tooltip'
import LobbyChat from '@/widgets/LobbyChat/LobbyChat'
import LobbyPlayers from '@/widgets/LobbyPlayers/LobbyPlayers'
import UnitToggleGroup from '@/widgets/UnitToggleGroup/UnitToggleGroup'
import { AudioLines, Copy, CopyCheck, LogOut } from 'lucide-react'
import {
  LegacyRef,
  MutableRefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

export default function Lobby() {
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)
  const round = useAppSelector((state) => state.round.value)
  const volume = useAppSelector((state) => state.volume.value)
  const stage = useAppSelector((state) => state.stage.value)
  const roomConfig = useAppSelector((state) => state.roomConfig.value)
  const user = useAppSelector((state) => state.user.value)
  const roundCount: MutableRefObject<NodeJS.Timeout> = useRef(null)
  const count: MutableRefObject<number> = useRef(round.timeLeft)
  const roundSound: MutableRefObject<HTMLAudioElement> = useRef(null)
  const leaveButtonRef: MutableRefObject<HTMLButtonElement> = useRef(null)
  const [copied, setCopied] = useState(false)
  const timeoutID: MutableRefObject<ReturnType<typeof setTimeout>> =
    useRef(undefined)
  const scrollAreaRef: LegacyRef<HTMLDivElement> = useOutletContext()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const introSpeechAud = useMemo(
    () => new Audio(announceSounds['introSpeech.mp3']),
    []
  )
  const timesUpAud = useMemo(() => new Audio(announceSounds['timesUp.mp3']), [])
  const countdownAud = useMemo(
    () => new Audio(announceSounds['countdown.mp3']),
    []
  )

  const randomBg = useMemo(() => {
    const bgKeys = Object.keys(bgLobby) as Array<keyof typeof bgLobby>
    return bgLobby[bgKeys[Math.floor(Math.random() * bgKeys.length)]]
  }, [])

  useEffect(() => {
    if (stage === 'init') {
      navigate('/', { replace: true })
    }
    leaveButtonRef.current.disabled = false
  }, [])

  useEffect(() => {
    if (roundSound.current !== null) {
      roundSound.current.volume = volume
    }
    introSpeechAud.volume = volume
    timesUpAud.volume = volume
    countdownAud.volume = volume
  }, [volume])

  useEffect(() => {
    const playRound = async () => {
      if (round.started) {
        roundCount.current = setInterval(() => {
          if (count.current < 1) {
            dispatch(setRoundStarted(false))
          } else {
            count.current -= 1
            dispatch(setTimeLeft(count.current))
            if (count.current <= 3) {
              countdownAud.play()
            }
          }
        }, 1000)
      }
      if (roundCount.current !== null && !round.started && stage === 'game') {
        clearInterval(roundCount.current)
        if (roundSound.current !== null) {
          roundSound.current.pause()
          roundSound.current = null
        }
        timesUpAud.volume = volume
        await waitAndPlaySound(timesUpAud)
        socket.emit('roundAnswer', round.chosenUnit)
        const isDev = process.env.NODE_ENV === 'development'
        count.current = isDev ? 5 : 20
        dispatch(setTimeLeft(isDev ? 5 : 20))
      }
    }

    playRound()

    return () => {
      clearInterval(roundCount.current)
    }
  }, [round.started])

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const playSoundStart = async () => {
      if (stage === 'game') {
        try {
          introSpeechAud.volume = volume
          await waitAndPlaySound(introSpeechAud, 2000, signal)
          socket.emit('getSoundForRound')
        } catch (error) {
          if (error.name !== 'AbortError') {
            console.error(error)
          }
        }
      }
    }

    playSoundStart()

    return () => {
      controller.abort()
    }
  }, [stage])

  function repeatSoundForRound() {
    if (roundSound.current === null) {
      roundSound.current = new Audio(round.soundUrl)
    }
    roundSound.current.volume = volume
    roundSound.current.pause()
    roundSound.current.currentTime = 0
    roundSound.current.play()
  }

  function onLeaveButtonHandler() {
    leaveButtonRef.current.disabled = true
    socket.emit('leaveLobby', user.id, user.role)
    dispatch(setRole(null))
    dispatch(setChosenUnit(''))
  }

  function onCopyButtonClick() {
    navigator.clipboard.writeText(roomConfig.id)
    setCopied(true)
    if (timeoutID.current) {
      clearTimeout(timeoutID.current)
    }
    timeoutID.current = setTimeout(() => setCopied(false), 3000)
  }

  function onStart() {
    socket.emit('startGame')
  }

  function onToLobby() {
    socket.emit('toLobby')
  }

  return (
    <div className="relative flex flex-grow flex-col justify-center items-center">
      <div
        className="absolute right-0 top-0 h-full w-full bg-cover bg-center mix-blend-soft-light"
        style={{
          backgroundImage: `url(${randomBg})`,
        }}
      ></div>
      <button
        ref={leaveButtonRef}
        className="absolute top-5 left-5 flex items-center gap-2 bg-red-800 p-2 text-slate-200 rounded-lg"
        onClick={() => onLeaveButtonHandler()}
      >
        <p>Leave</p>
        <LogOut />
      </button>
      <LobbyChat ref={scrollAreaRef} className="absolute bottom-5 left-5" />
      {round.started && (
        <div className="relative z-10">
          <p className="text-xl font-bold text-center">
            Time left: {round.timeLeft}
          </p>
          <button
            onClick={() => repeatSoundForRound()}
            className="bg-yellow-400 p-2 rounded-lg flex justify-between items-center gap-2"
          >
            <p>Repeat sound</p>
            <AudioLines />
          </button>
        </div>
      )}
      {stage === 'game' && (
        <p className="relative z-10 text-xl font-bold">
          Round: {round.currentRound}
        </p>
      )}
      {lobbyPlayers.length !== 0 && <LobbyPlayers />}
      {stage === 'lobby' && (
        <TooltipProvider>
          <Tooltip open={copied ? true : undefined}>
            <TooltipTrigger className="relative z-10" asChild>
              <button
                className="rounded-md p-1 bg-blue-200 flex justify-center items-center gap-2 font-bold"
                onClick={() => onCopyButtonClick()}
              >
                <p className="uppercase">Share: {roomConfig.id}</p>
                {copied ? <CopyCheck /> : <Copy />}
              </button>
            </TooltipTrigger>
            <TooltipContent className="relative z-10">
              <div>{copied ? 'Copied!' : 'Copy'}</div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )}
      {user.role === 'host' && stage === 'lobby' && (
        <button
          className="relative z-10 bg-green-800 p-2 text-slate-200 rounded-lg"
          onClick={() => onStart()}
        >
          Start
        </button>
      )}
      {user.role === 'host' && stage === 'results' && (
        <button
          className="relative z-10 bg-green-800 p-2 text-slate-200 rounded-lg"
          onClick={() => onToLobby()}
        >
          To lobby
        </button>
      )}
      {stage === 'results' && user.role === 'player' && (
        <p className="relative z-10">Waiting for host to return to lobby...</p>
      )}
      {stage === 'game' && <UnitToggleGroup />}
    </div>
  )
}
