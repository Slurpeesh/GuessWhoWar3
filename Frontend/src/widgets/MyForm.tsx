import { socket } from '@/app/socket'
import { FormEvent, MutableRefObject, useRef, useState } from 'react'

export default function MyForm() {
  const [value, setValue] = useState('')
  const inputRef: MutableRefObject<HTMLInputElement> = useRef()

  function onSubmit(e: FormEvent) {
    e.preventDefault()

    socket.emit('createMessage', value)
    inputRef.current.value = ''
  }

  return (
    <form onSubmit={onSubmit}>
      <input
        className="bg-slate-200"
        ref={inputRef}
        onChange={(e) => setValue(e.target.value)}
      />

      <button className="p-2 bg-slate-400" type="submit">
        Submit
      </button>
    </form>
  )
}
