import { useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import Card from '@/entities/Card/Card'

export default function LobbyPlayers() {
  const user = useAppSelector((state) => state.user.value)
  const stage = useAppSelector((state) => state.stage.value)
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)

  return (
    <Card
      className={cn(
        'relative z-20 shadow-md flex flex-col gap-2 justify-center items-center rounded-lg overflow-hidden p-2'
      )}
    >
      <ul className="relative z-20 p-1 flex flex-col gap-2 justify-center items-center">
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
                  'bg-success/50': player.id === user.id,
                  'ring-2 ring-alert bg-gradient-to-br from-success to-alert':
                    isWinner &&
                    stage === 'results' &&
                    player.id === socket.id &&
                    pointsOfPlayer > 0,
                  'ring-2 ring-alert bg-gradient-to-br from-accent/30 to-alert':
                    isWinner &&
                    stage === 'results' &&
                    player.id !== socket.id &&
                    pointsOfPlayer > 0,
                  'ring-2 ring-danger bg-gradient-to-br from-success to-danger':
                    isWinner &&
                    stage === 'results' &&
                    player.id === socket.id &&
                    pointsOfPlayer === 0,
                  'ring-2 ring-danger bg-gradient-to-br from-accent/30 to-danger':
                    isWinner &&
                    stage === 'results' &&
                    player.id !== socket.id &&
                    pointsOfPlayer === 0,
                }
              )}
              key={index}
            >
              <span className="w-32 md:w-40 break-all">
                Name: {player.name}
              </span>
              <span className="w-20 md:w-24 break-words">
                Role: {player.role}
              </span>
              <span className="w-16 md:w-20 break-words">
                Points: {player.points}
              </span>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
