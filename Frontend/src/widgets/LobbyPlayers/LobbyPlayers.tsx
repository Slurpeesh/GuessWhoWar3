import { useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { socket } from '@/app/socket'

export default function LobbyPlayers() {
  const user = useAppSelector((state) => state.user.value)
  const stage = useAppSelector((state) => state.stage.value)
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)

  return (
    <ul
      className={cn(
        'bg-blue-200/50 shadow-md flex flex-col gap-2 justify-center items-center rounded-lg overflow-hidden p-2',
        {
          flex: stage === 'results',
          'absolute top-5 right-5': stage !== 'results',
        }
      )}
    >
      {lobbyPlayers.map((player, index, arr) => {
        const pointsOfPlayer = player.points
        let isWinner: boolean = true
        for (let i = 0; i < arr.length; i++) {
          if (pointsOfPlayer < arr[i].points) {
            isWinner = false
          }
        }
        return (
          <li
            className={cn(
              'py-1 px-2 rounded-lg w-full flex gap-2 justify-between',
              {
                'bg-green-400': player.id === user.id,
                'ring-2 ring-yellow-500 bg-gradient-to-br from-green-400 to-yellow-500':
                  isWinner &&
                  stage === 'results' &&
                  player.id === socket.id &&
                  pointsOfPlayer > 0,
                'ring-2 ring-yellow-500 bg-gradient-to-br from-blue-200 to-yellow-500':
                  isWinner &&
                  stage === 'results' &&
                  player.id !== socket.id &&
                  pointsOfPlayer > 0,
                'ring-2 ring-red-500 bg-gradient-to-br from-green-400 to-red-500':
                  isWinner &&
                  stage === 'results' &&
                  player.id === socket.id &&
                  pointsOfPlayer === 0,
                'ring-2 ring-red-500 bg-gradient-to-br from-blue-200 to-red-500':
                  isWinner &&
                  stage === 'results' &&
                  player.id !== socket.id &&
                  pointsOfPlayer === 0,
              }
            )}
            key={index}
          >
            <span className="w-3/6 break-words">Name:{player.name}</span>
            <span className="w-2/6 break-words">Role:{player.role}</span>
            <span className="w-1/6 break-words">Points:{player.points}</span>
          </li>
        )
      })}
    </ul>
  )
}
