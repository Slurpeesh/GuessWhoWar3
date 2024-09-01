import { useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/Accordion/Accordion'

export default function AccordionLobbyPlayers() {
  const user = useAppSelector((state) => state.user.value)
  const stage = useAppSelector((state) => state.stage.value)
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)

  return (
    <div
      className={cn(
        'shadow-md flex flex-col gap-2 justify-center items-center rounded-lg overflow-hidden p-2',
        {
          'relative z-10': stage === 'results',
          'absolute z-10 top-5 right-5': stage !== 'results',
        }
      )}
    >
      <div className="absolute bg-accent/30 backdrop-blur-sm top-0 left-0 w-full h-full"></div>
      <Accordion
        className="relative z-10"
        type="single"
        collapsible={stage !== 'results'}
        defaultValue="players"
      >
        <AccordionItem value="players">
          <AccordionTrigger className="px-2 mx-1 w-[23rem]">
            Players
          </AccordionTrigger>
          <AccordionContent>
            <ul className="p-1 flex flex-col gap-2 justify-center items-center">
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
                    <span className="w-40 break-all">Name: {player.name}</span>
                    <span className="w-24 break-words">
                      Role: {player.role}
                    </span>
                    <span className="w-20 break-words">
                      Points: {player.points}
                    </span>
                  </li>
                )
              })}
            </ul>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
