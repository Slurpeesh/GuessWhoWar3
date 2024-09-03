import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { setDark, setLight } from '@/app/store/slices/themeSlice'
import { Moon, Sun } from 'lucide-react'
import { ButtonHTMLAttributes } from 'react'

interface IThemeButton extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string
}

export default function ThemeButton({ className, ...rest }: IThemeButton) {
  const theme = useAppSelector((state) => state.theme.value)
  const dispatch = useAppDispatch()

  function changeThemeHandler() {
    switch (theme) {
      case 'dark':
        dispatch(setLight())
        return
      default:
        dispatch(setDark())
    }
  }
  return (
    <button
      className={cn(
        'w-12 h-12 p-2 rounded-full transition-colors hover:bg-muted/30',
        className
      )}
      onClick={() => changeThemeHandler()}
      aria-label={
        theme === 'dark' ? 'Change to light theme' : 'Change to dark theme'
      }
      {...rest}
    >
      {theme == 'light' && (
        <Sun className="h-full w-full stroke-accent stoke-2" />
      )}
      {theme == 'dark' && (
        <Moon className="h-full w-full stroke-accent stoke-2" />
      )}
    </button>
  )
}
