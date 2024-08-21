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
    <div className="flex flex-col justify-center items-center gap-10">
      <h2 className="text-3xl font-bold">Join existing lobby</h2>
      <form
        onSubmit={(e) => onSubmitHandle(e)}
        className="flex flex-col gap-5 items-center text-xl font-medium"
      >
        <div className="grid grid-cols-3 gap-5">
          <label className="content-center" htmlFor="name">
            Your name:
          </label>
          <input
            className="col-span-2 ml-2 rounded-md p-1"
            id="name"
            type="text"
            value={user.name}
            maxLength={20}
            onChange={(e) => onChangeName(e)}
          />
          <label className="content-center" htmlFor="roomId">
            Room ID:
          </label>
          <input
            className="col-span-2 ml-2 rounded-md p-1"
            id="roomId"
            type="text"
            value={joinRoomId}
            maxLength={20}
            onChange={(e) => onChangeRoomId(e)}
          />
        </div>
        <button className="bg-blue-200 rounded-md p-2 hover:bg-blue-300 transition-colors w-1/2">
          Join
        </button>
      </form>
    </div>
  )
}
