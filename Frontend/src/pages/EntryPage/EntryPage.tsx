import { bgMain } from '@/app/lib/imgs'
import Loader from '@/entities/Loader/Loader'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function EntryPage() {
  return (
    <>
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
      </div>
      <div className="relative basis-2/3 bg-blue-300 flex flex-col justify-center items-center">
        <Suspense fallback={<Loader className="w-32" />}>
          <Outlet />
        </Suspense>
        <div
          className="absolute right-0 top-0 h-full w-full bg-cover bg-center mix-blend-soft-light"
          style={{ backgroundImage: `url(${bgMain})` }}
        ></div>
      </div>
    </>
  )
}
