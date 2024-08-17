import { useAppSelector } from '@/app/hooks/useActions'
import announceSounds from '@/app/lib/announceSounds'
import { waitAndPlaySound } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import LobbyPlayers from '@/widgets/LobbyPlayers/LobbyPlayers'
import UnitToggleGroup from '@/widgets/UnitToggleGroup/UnitToggleGroup'
import { useEffect } from 'react'

const introSpeechAud = new Audio(announceSounds['introSpeech.mp3'])

export default function Lobby() {
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)
  const stage = useAppSelector((state) => state.stage.value)

  useEffect(() => {
    const playSound = async () => {
      if (stage === 'game') {
        await waitAndPlaySound(introSpeechAud, 2000)
        socket.emit('getSoundForRound')
        console.log('Now sound of unit selected by server plays')
      }
    }

    playSound()
  }, [stage])

  return (
    <div className="flex flex-grow flex-col justify-center items-center">
      {lobbyPlayers.length !== 0 && <LobbyPlayers />}
      {stage === 'game' && <UnitToggleGroup />}
    </div>
  )
}
