import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import announceSounds from '@/app/lib/announceSounds'
import { bgLobby } from '@/app/lib/imgs'
import { waitAndPlaySound } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import { setChatMobileModal } from '@/app/store/slices/chatMobileModalSlice'
import {
  setChosenUnit,
  setRoundStarted,
  setTimeLeft,
} from '@/app/store/slices/roundSlice'
import { setRole } from '@/app/store/slices/userSlice'
import AccordionLobbyPlayers from '@/features/AccordionLobbyPlayers/AccordionLobbyPlayers'
import LobbyPlayers from '@/features/LobbyPlayers/LobbyPlayers'
import ShareCopyButton from '@/features/ShareCopyButton/ShareCopyButton'
import LobbyChat from '@/widgets/LobbyChat/LobbyChat'
import MobileModalChat from '@/widgets/MobileModalChat/MobileModalChat'
import UnitToggleGroup from '@/widgets/UnitToggleGroup/UnitToggleGroup'
import {
  AudioLines,
  CornerUpLeft,
  LogOut,
  MessageCircle,
  Play,
} from 'lucide-react'
import { LegacyRef, MutableRefObject, useEffect, useMemo, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

export default function Lobby() {
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)
  const round = useAppSelector((state) => state.round.value)
  const volume = useAppSelector((state) => state.volume.value)
  const stage = useAppSelector((state) => state.stage.value)
  const user = useAppSelector((state) => state.user.value)
  const messages = useAppSelector((state) => state.messages.value)
  const device = useAppSelector((state) => state.device.value)
  const chatMobileModal = useAppSelector((state) => state.chatMobileModal.value)
  const roundCount: MutableRefObject<NodeJS.Timeout> = useRef(null)
  const count: MutableRefObject<number> = useRef(round.timeLeft)
  const roundSound: MutableRefObject<HTMLAudioElement> = useRef(null)
  const leaveButtonRef: MutableRefObject<HTMLButtonElement> = useRef(null)
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

  const unseenMessages = useMemo(() => {
    return messages.filter((message) => !message.isSeen)
  }, [messages])

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

  function onStart() {
    socket.emit('startGame')
  }

  function onToLobby() {
    socket.emit('toLobby')
  }

  function onOpenChat() {
    dispatch(setChatMobileModal(true))
  }

  return (
    <div className="relative flex flex-grow flex-col justify-center items-center bg-background">
      <div
        className="fixed right-0 top-0 h-full w-full bg-cover bg-center mix-blend-soft-light"
        style={{
          backgroundImage: `url(${randomBg})`,
        }}
      ></div>
      <div className="w-full h-20" aria-hidden="true"></div>
      <button
        ref={leaveButtonRef}
        className="fixed z-20 top-5 left-5 flex items-center gap-2 bg-danger hover:bg-danger-hover disabled:bg-muted transition-colors p-2 rounded-lg"
        onClick={() => onLeaveButtonHandler()}
      >
        <p>Leave</p>
        <LogOut />
      </button>
      {device !== 'mobile' ? (
        <LobbyChat ref={scrollAreaRef} className="fixed z-20 bottom-5 left-5" />
      ) : (
        <button
          className="fixed z-20 bottom-3 left-3 w-12 h-12 p-2 rounded-full transition-colors hover:bg-muted/30"
          onClick={() => onOpenChat()}
          aria-label="Open chat"
        >
          <MessageCircle className="h-full w-full stroke-accent" />
          {unseenMessages.length !== 0 && (
            <div className="absolute top-2 right-1 w-5 aspect-square rounded-full bg-danger text-xs font-semibold text-center content-center">
              {unseenMessages.length < 10 ? unseenMessages.length : '9+'}
            </div>
          )}
        </button>
      )}

      {chatMobileModal && <MobileModalChat ref={scrollAreaRef} />}
      <div className="flex-grow flex flex-col gap-2 justify-center items-center px-2">
        {stage === 'game' && (
          <div className="relative z-10">
            <p className="text-xl font-bold text-center">
              Round: {round.currentRound}
            </p>
            {round.started && (
              <>
                <p className="text-xl font-bold text-center">
                  Time left: {round.timeLeft}
                </p>
                <button
                  onClick={() => repeatSoundForRound()}
                  className="bg-alert hover:bg-alert-hover p-2 rounded-lg flex justify-between items-center gap-2"
                >
                  <p>Repeat sound</p>
                  <AudioLines />
                </button>
              </>
            )}
          </div>
        )}
        {lobbyPlayers.length !== 0 && stage !== 'results' && (
          <AccordionLobbyPlayers />
        )}
        {lobbyPlayers.length !== 0 && stage === 'results' && <LobbyPlayers />}
        {stage === 'lobby' && <ShareCopyButton />}
        {user.role === 'host' && stage === 'lobby' && (
          <button
            className="relative z-10 flex items-center gap-2 bg-success hover:bg-success-hover transition-colors p-2 rounded-lg"
            onClick={() => onStart()}
          >
            <span>Start</span>
            <Play className="w-5 h-5" />
          </button>
        )}
        {user.role === 'host' && stage === 'results' && (
          <button
            className="relative z-10 flex items-center gap-2 bg-success hover:bg-success-hover transition-colors p-2 rounded-lg"
            onClick={() => onToLobby()}
          >
            <CornerUpLeft className="w-5 h-5" />
            <span>To lobby</span>
          </button>
        )}
        {stage === 'results' && user.role === 'player' && (
          <p className="relative z-10">
            Waiting for host to return to lobby...
          </p>
        )}
        {stage === 'game' && <UnitToggleGroup />}
      </div>
      <div className="w-full h-[4.5rem]" aria-hidden="true"></div>
    </div>
  )
}
