import { useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'

export default function ConnectionState() {
  const isConnected = useAppSelector((state) => state.isConnected.value)
  return (
    <p
      className={cn({
        'bg-green-300': isConnected,
        'bg-red-300': !isConnected,
      })}
    >
      Connected: {'' + isConnected}
    </p>
  )
}
