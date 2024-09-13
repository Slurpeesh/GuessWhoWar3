import { bgMain, bgTwl } from '@/app/lib/imgs'
import Loader from '@/entities/Loader/Loader'
import { ExternalLink } from 'lucide-react'
import { Suspense } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

export default function EntryPage() {
  return (
    <>
      <div className="relative basis-1/3 bg-background flex justify-center items-center p-5">
        <div className="relative z-10 flex flex-col gap-5 justify-center items-center">
          <h1 className="text-3xl font-bold">GuessWhoWar3</h1>
          <NavLink
            className={({ isActive }) => {
              return [
                'p-2 rounded-lg w-52 text-center text-foreground-within-accent',
                isActive
                  ? 'bg-accent-hover pointer-events-none'
                  : 'bg-accent hover:bg-accent-hover transition-colors',
              ].join(' ')
            }}
            to="/host"
          >
            Host new lobby
          </NavLink>
          <NavLink
            className={({ isActive }) => {
              return [
                'p-2 rounded-lg w-52 text-center text-foreground-within-accent',
                isActive
                  ? 'bg-accent-hover pointer-events-none'
                  : 'bg-accent hover:bg-accent-hover transition-colors',
              ].join(' ')
            }}
            to="/join"
          >
            Join lobby
          </NavLink>
          <p className="text-sm text-center">
            Inspired by{' '}
            <a
              href="https://www.hiveworkshop.com/threads/the-weakest-link-v1-01.78089/"
              target="_blank"
              className="inline-flex items-center underline underline-offset-4 hover:text-accent-hover"
            >
              <span>Brian Deksnys's map The Weakest Link</span>
              <ExternalLink className="w-4 h-4 stroke-[1.5]" />
            </a>{' '}
            for Warcraft 3
          </p>
        </div>

        <div
          className="absolute left-0 top-0 h-full w-full bg-cover bg-left mix-blend-lighten dark:mix-blend-soft-light"
          style={{ backgroundImage: `url(${bgTwl})` }}
        ></div>
      </div>
      <div className="relative basis-2/3 bg-background flex flex-col justify-center items-center p-5">
        <Suspense fallback={<Loader className="relative z-50 w-32" />}>
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
