import { useAppSelector } from '@/app/hooks/useActions'
import { socket } from '@/app/socket'
import { SendHorizontal } from 'lucide-react'
import { FormEvent, MutableRefObject, useRef, useState } from 'react'

export default function LobbyChatForm() {
  const [value, setValue] = useState('')
  const user = useAppSelector((state) => state.user.value)
  const inputRef: MutableRefObject<HTMLInputElement> = useRef()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (value.trim().length === 0) {
      return
    }

    socket.emit('createMessage', value, user.name)
    inputRef.current.value = ''
    setValue('')
  }

  return (
    <form onSubmit={onSubmit} className="flex gap-2 justify-between">
      <input
        className="bg-slate-200 flex-grow rounded-md px-1"
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Throm'ka"
      />

      <button
        className="p-1 px-2 bg-blue-200 hover:bg-blue-300 transition-colors rounded-md"
        type="submit"
      >
        <SendHorizontal className="w-5 h-5" />
      </button>
    </form>
  )
}
