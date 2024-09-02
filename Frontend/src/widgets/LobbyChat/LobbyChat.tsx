import { useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import Card from '@/entities/Card/Card'
import LobbyChatForm from '@/features/LobbyChatForm/LobbyChatForm'
import { ScrollArea } from '@/shared/ScrollArea/ScrollArea'
import { forwardRef, LegacyRef } from 'react'

interface ILobbyChat {
  className?: string
}

const LobbyChat = forwardRef(function LobbyChat(
  { className }: ILobbyChat,
  ref: LegacyRef<HTMLDivElement>
) {
  const messages = useAppSelector((state) => state.messages.value)
  const device = useAppSelector((state) => state.device.value)

  return (
    <div
      className={cn('flex flex-col w-52 md:w-80 gap-2', className, {
        'w-80': device === 'mobile',
      })}
    >
      <ScrollArea
        ref={ref}
        className={cn(' h-40 rounded-md pr-4', { 'h-80': device === 'mobile' })}
      >
        <ul className="text-sm">
          {messages.map((message, index, arr) => {
            return (
              <div
                className={cn('flex justify-between items-center', {
                  'justify-end': message.senderId === socket.id,
                })}
                key={index}
              >
                <Card className="p-2 my-1 rounded-lg w-2/3 break-all">
                  <li className="relative z-10">
                    <span className="font-semibold">
                      {message.senderName}:{' '}
                    </span>
                    <span>{message.value}</span>
                  </li>
                </Card>
              </div>
            )
          })}
        </ul>
      </ScrollArea>
      <LobbyChatForm />
    </div>
  )
})

export default LobbyChat
