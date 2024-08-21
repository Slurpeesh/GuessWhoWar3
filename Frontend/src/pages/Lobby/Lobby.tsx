import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import announceSounds from '@/app/lib/announceSounds'
import { waitAndPlaySound } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import { setRoundStarted, setTimeLeft } from '@/app/store/slices/roundSlice'
import LobbyPlayers from '@/widgets/LobbyPlayers/LobbyPlayers'
import UnitToggleGroup from '@/widgets/UnitToggleGroup/UnitToggleGroup'
import { AudioLines } from 'lucide-react'
import { MutableRefObject, useEffect, useRef } from 'react'

const introSpeechAud = new Audio(announceSounds['introSpeech.mp3'])
const timesUpAud = new Audio(announceSounds['timesUp.mp3'])
const countdownAud = new Audio(announceSounds['countdown.mp3'])

export default function Lobby() {
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)
  const round = useAppSelector((state) => state.round.value)
  const stage = useAppSelector((state) => state.stage.value)
  const roundCount: MutableRefObject<NodeJS.Timeout> = useRef(null)
  const count: MutableRefObject<number> = useRef(round.timeLeft)
  const roundSound: MutableRefObject<HTMLAudioElement> = useRef(null)
  const dispatch = useAppDispatch()

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
        await waitAndPlaySound(timesUpAud)
        socket.emit('roundAnswer', round.chosenUnit)
        //FIXME: change time to >= 20
        count.current = 5
        dispatch(setTimeLeft(5))
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
    roundSound.current.pause()
    roundSound.current.currentTime = 0
    roundSound.current.play()
  }

  return (
    <div className="flex flex-grow flex-col justify-center items-center">
      {round.started && (
        <>
          <div className="text-xl font-bold">Time left: {round.timeLeft}</div>
          <button
            onClick={() => repeatSoundForRound()}
            className="bg-yellow-400 p-2 rounded-lg flex justify-between items-center gap-2"
          >
            <p>Repeat sound</p>
            <AudioLines />
          </button>
        </>
      )}
      {stage === 'game' && (
        <div className="text-xl font-bold">Round: {round.currentRound}</div>
      )}
      {lobbyPlayers.length !== 0 && <LobbyPlayers />}
      {stage === 'game' && <UnitToggleGroup />}
    </div>
  )
}
