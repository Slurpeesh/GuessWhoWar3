import { useAppSelector } from '@/app/hooks/useActions'
import { Link } from 'react-router-dom'

export default function Lobby() {
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)

  return (
    <div className="w-dvw h-dvh bg-blue-200 flex flex-col justify-center items-center">
      <Link to="/">Leave</Link>
      <ul>
        {lobbyPlayers.map((player, index) => {
          console.log(player)
          return (
            <li key={index}>
              {player.id}: {player.name}: {player.role}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
