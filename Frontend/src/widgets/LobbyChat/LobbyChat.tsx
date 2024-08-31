import { useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { socket } from '@/app/socket'
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

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <ScrollArea ref={ref} className={cn('w-80 h-40 rounded-md pr-4')}>
        <ul className="text-sm">
          {messages.map((message, index, arr) => {
            console.log(message.senderId === socket.id)
            const messageClassName = cn(
              'p-2 my-1 rounded-lg w-2/3 break-all bg-accent/30 backdrop-blur-sm transition-colors'
            )
            return (
              <div
                className={cn('flex justify-between items-center', {
                  'justify-end': message.senderId === socket.id,
                })}
                key={index}
              >
                <li className={messageClassName}>
                  <span className="font-semibold">{message.senderName}: </span>
                  {message.value}
                </li>
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
