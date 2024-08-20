import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { testDigits } from '@/app/lib/regex'
import { socket } from '@/app/socket'
import {
  setRoomId,
  setRoomMaxPlayers,
  setRoomRounds,
} from '@/app/store/slices/roomConfigSlice'
import { changeUserName, setRole } from '@/app/store/slices/userSlice'
import { Repeat } from 'lucide-react'
import { ChangeEvent, FormEvent, MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'

export default function HostPage() {
  const user = useAppSelector((state) => state.user.value)
  const roomConfig = useAppSelector((state) => state.roomConfig.value)
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  function onSubmitHandle(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (roomConfig.maxPlayers === 0 || roomConfig.rounds === 0) {
      return
    }
    socket.emit('hostGame', user.name, roomConfig)
    dispatch(setRole('host'))
  }

  function onChangeName(e: ChangeEvent<HTMLInputElement>) {
    dispatch(changeUserName(e.target.value))
  }

  function onChangeRoomId(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setRoomId(e.target.value))
  }

  function onChangeRounds(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (!testDigits(value)) {
      e.target.value = value.slice(0, -1)
    }
    const rounds = Number(e.target.value)
    dispatch(setRoomRounds(rounds))
  }

  function onChangeMaxPlayers(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    if (!testDigits(value)) {
      e.target.value = value.slice(0, -1)
    }
    const maxPlayers = Number(e.target.value)
    dispatch(setRoomMaxPlayers(maxPlayers))
  }

  function onRegenerateButtonClick(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    dispatch(setRoomId(Date.now().toString()))
  }

  return (
    <div className="flex flex-col justify-center items-center gap-10">
      <h2 className="text-3xl font-bold">Host new lobby</h2>
      <form
        onSubmit={(e) => onSubmitHandle(e)}
        className="flex flex-col gap-5 items-center text-xl font-medium"
      >
        {roomConfig.maxPlayers === 0 && (
          <div className="text-xl font-semibold text-red-800">
            Max players must be at least 1
          </div>
        )}
        {roomConfig.rounds === 0 && (
          <div className="text-xl font-semibold text-red-800">
            Rounds must be at least 1
          </div>
        )}
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
          <div className="col-span-2 ml-2 rounded-md p-1 flex bg-white">
            <input
              id="roomId"
              type="text"
              value={roomConfig.id}
              onChange={(e) => onChangeRoomId(e)}
              disabled
            />
            <button onClick={(e) => onRegenerateButtonClick(e)}>
              <Repeat />
            </button>
          </div>

          <label className="content-center" htmlFor="rounds">
            Rounds:
          </label>
          <input
            className="col-span-2 ml-2 rounded-md p-1"
            id="rounds"
            type="text"
            value={roomConfig.rounds}
            maxLength={2}
            onChange={(e) => onChangeRounds(e)}
          />
          <label className="content-center" htmlFor="maxPlayers">
            Max players:
          </label>
          <input
            className="col-span-2 ml-2 rounded-md p-1"
            id="maxPlayers"
            type="text"
            value={roomConfig.maxPlayers}
            maxLength={2}
            onChange={(e) => onChangeMaxPlayers(e)}
          />
        </div>
        <button className="bg-blue-200 rounded-md p-2 hover:bg-blue-300 transition-colors w-1/2">
          Host
        </button>
      </form>
    </div>
  )
}
