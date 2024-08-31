import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { setDark, setLight } from '@/app/store/slices/themeSlice'
import { Moon, Sun } from 'lucide-react'

export default function ThemeButton() {
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
      className="absolute z-50 top-5 left-40 w-12 h-12 p-2 rounded-full transition-colors hover:bg-muted/30"
      onClick={() => changeThemeHandler()}
      aria-label={
        theme === 'dark' ? 'Change to light theme' : 'Change to dark theme'
      }
    >
      {theme == 'light' && <Sun className="h-full w-full stroke-accent" />}
      {theme == 'dark' && <Moon className="h-full w-full stroke-accent" />}
    </button>
  )
}
