import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { socket } from '@/app/socket'
import { setChosenUnit } from '@/app/store/slices/roundSlice'
import { setRole } from '@/app/store/slices/userSlice'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/Tooltip/Tooltip'
import { Copy, CopyCheck } from 'lucide-react'
import { MutableRefObject, useRef, useState } from 'react'

export default function LobbyPlayers() {
  const user = useAppSelector((state) => state.user.value)
  const roomConfig = useAppSelector((state) => state.roomConfig.value)
  const stage = useAppSelector((state) => state.stage.value)
  const [copied, setCopied] = useState(false)
  const timeoutID: MutableRefObject<ReturnType<typeof setTimeout>> =
    useRef(undefined)
  const dispatch = useAppDispatch()

  function onLeaveButtonHandler() {
    console.log(user.id, user.role)
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
  const lobbyPlayers = useAppSelector((state) => state.lobbyPlayers.value)
  return (
    <>
      <button
        className="absolute top-5 left-5 bg-red-800 p-2 text-slate-200 rounded-lg"
        onClick={() => onLeaveButtonHandler()}
      >
        Leave
      </button>
      <div className="bg-blue-200 flex flex-col justify-center items-center">
        <ul>
          {lobbyPlayers.map((player, index) => {
            return (
              <li
                className={cn({ 'bg-green-400': player.id === user.id })}
                key={index}
              >
                ID:{player.id} Name:{player.name} Role:{player.role} Points:
                {player.points}
              </li>
            )
          })}
        </ul>
      </div>
      {user.role === 'host' && stage === 'lobby' && (
        <button
          className="bg-green-800 p-2 text-slate-200 rounded-lg"
          onClick={() => onStart()}
        >
          Start
        </button>
      )}
      <TooltipProvider>
        <Tooltip open={copied ? true : undefined}>
          <TooltipTrigger asChild>
            <button
              className="rounded-md p-1 bg-blue-200 flex justify-center items-center gap-2 font-bold"
              onClick={() => onCopyButtonClick()}
            >
              <p className="uppercase">Share: {roomConfig.id}</p>
              {copied ? <CopyCheck /> : <Copy />}
            </button>
          </TooltipTrigger>
          <TooltipContent>
            <div>{copied ? 'Copied!' : 'Copy'}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </>
  )
}
