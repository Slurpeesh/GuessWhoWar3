import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { socket } from '@/app/socket'
import { changeUserName, setRole } from '@/app/store/slices/userSlice'
import { ChangeEvent, FormEvent, useState } from 'react'

export default function JoinPage() {
  const user = useAppSelector((state) => state.user.value)
  const [joinRoomId, setJoinRoomId] = useState('0000000000000')
  const dispatch = useAppDispatch()

  function onSubmitHandle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (user.name.length === 0) return
    socket.emit('joinGame', user.name, joinRoomId)
    dispatch(setRole('player'))
  }

  function onChangeName(e: ChangeEvent<HTMLInputElement>) {
    dispatch(changeUserName(e.target.value))
  }

  function onChangeRoomId(e: ChangeEvent<HTMLInputElement>) {
    setJoinRoomId(e.target.value)
  }

  return (
    <div className="relative z-10 flex flex-col justify-center items-center gap-2 md:gap-5">
      <h2 className="text-3xl font-bold">Join existing lobby</h2>
      {user.name.length === 0 && (
        <p className="text-base md:text-xl font-semibold text-danger-hover">
          Name is empty
        </p>
      )}
      <form
        onSubmit={(e) => onSubmitHandle(e)}
        className="flex flex-col gap-5 items-center text-xl font-medium"
      >
        <div className="grid grid-cols-3 gap-2 md:gap-5">
          <label className="content-center text-base md:text-lg" htmlFor="name">
            Your name:
          </label>
          <input
            className="col-span-2 ml-2 rounded-md p-1 bg-muted"
            id="name"
            type="text"
            value={user.name}
            maxLength={20}
            onChange={(e) => onChangeName(e)}
          />
          <label
            className="content-center text-base md:text-lg"
            htmlFor="roomId"
          >
            Room ID:
          </label>
          <input
            className="col-span-2 ml-2 rounded-md p-1 bg-muted"
            id="roomId"
            type="text"
            value={joinRoomId}
            maxLength={20}
            onChange={(e) => onChangeRoomId(e)}
          />
        </div>
        <button className="bg-accent text-foreground-within-accent rounded-md p-2 hover:bg-accent-hover transition-colors w-1/2">
          Join
        </button>
      </form>
    </div>
  )
}
