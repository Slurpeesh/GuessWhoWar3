import { useAppSelector } from '@/app/hooks/useActions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/Tooltip/Tooltip'
import { Copy, CopyCheck } from 'lucide-react'
import { MutableRefObject, useRef, useState } from 'react'

export default function ShareCopyButton() {
  const roomConfig = useAppSelector((state) => state.roomConfig.value)
  const [copied, setCopied] = useState(false)
  const timeoutID: MutableRefObject<ReturnType<typeof setTimeout>> =
    useRef(undefined)

  function onCopyButtonClick() {
    navigator.clipboard.writeText(roomConfig.id)
    setCopied(true)
    if (timeoutID.current) {
      clearTimeout(timeoutID.current)
    }
    timeoutID.current = setTimeout(() => setCopied(false), 3000)
  }

  return (
    <TooltipProvider>
      <Tooltip open={copied ? true : undefined}>
        <TooltipTrigger className="relative z-10" asChild>
          <button
            className="rounded-md p-1 bg-muted flex justify-center items-center gap-2 font-bold"
            onClick={() => onCopyButtonClick()}
          >
            <p className="uppercase">Share: {roomConfig.id}</p>
            {copied ? <CopyCheck /> : <Copy />}
          </button>
        </TooltipTrigger>
        <TooltipContent className="relative z-10">
          <div>{copied ? 'Copied!' : 'Copy'}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
