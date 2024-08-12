import Loader from '@/entities/Loader/Loader'
import { Suspense, useEffect } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAppDispatch } from './hooks/useActions'
import { socket } from './socket'
import { setConnected } from './store/slices/isConnectedSlice'
import { addMessage } from './store/slices/messagesSlice'

export default function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    function onConnect() {
      dispatch(setConnected(true))
    }

    function onDisconnect() {
      dispatch(setConnected(false))
    }

    function onMessage(value: string) {
      console.log(value)
      dispatch(addMessage({ value }))
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('message', onMessage)

    socket.connect()

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('message', onMessage)
    }
  }, [])

  return (
    <div className="w-dvw h-dvh flex">
      <div className="basis-1/3 bg-blue-300 flex flex-col gap-5 justify-center items-center">
        <NavLink
          className={({ isActive }) => {
            return [
              'p-2 rounded-lg text-slate-200 w-52 text-center',
              isActive
                ? 'bg-blue-700'
                : 'bg-blue-900 hover:bg-blue-700 transition-colors',
            ].join(' ')
          }}
          to="/host"
        >
          Host new lobby
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return [
              'p-2 rounded-lg text-slate-200 w-52 text-center',
              isActive
                ? 'bg-blue-700'
                : 'bg-blue-900 hover:bg-blue-700 transition-colors',
            ].join(' ')
          }}
          to="/join"
        >
          Join lobby
        </NavLink>
        <NavLink
          className={({ isActive }) => {
            return [
              'p-2 rounded-lg text-slate-200 w-52 text-center',
              isActive
                ? 'bg-blue-700'
                : 'bg-blue-900 hover:bg-blue-700 transition-colors',
            ].join(' ')
          }}
          to="/dev"
        >
          Socket Management (Dev)
        </NavLink>
      </div>
      <div className="basis-2/3 bg-blue-500 flex flex-col justify-center items-center">
        <Suspense fallback={<Loader className="w-32" />}>
          <Outlet />
        </Suspense>
      </div>
    </div>
  )
}
