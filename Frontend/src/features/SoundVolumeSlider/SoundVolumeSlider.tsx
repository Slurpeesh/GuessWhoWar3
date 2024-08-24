import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { setVolume } from '@/app/store/slices/volumeSlice'
import { Slider } from '@/shared/Slider/Slider'
import { Volume, Volume1, Volume2, VolumeX } from 'lucide-react'
import { MutableRefObject, useRef } from 'react'

interface ISoundVolumeSlider {
  className?: string
}

export default function SoundVolumeSlider({ className }: ISoundVolumeSlider) {
  const volume = useAppSelector((state) => state.volume.value)
  const restoreVolumeRef: MutableRefObject<number> = useRef(volume)
  const dispatch = useAppDispatch()

  function onVolumechange(value: Array<number>) {
    dispatch(setVolume(value[0]))
  }

  function onMuteVolume() {
    restoreVolumeRef.current = volume
    dispatch(setVolume(0))
  }

  function onResetVolume() {
    dispatch(setVolume(restoreVolumeRef.current))
  }

  return (
    <div className={cn('flex gap-2', className)}>
      {volume === 0 && (
        <button
          className="rounded-full hover:bg-blue-300/70 focus-visible:bg-blue-300/70 p-1"
          onClick={() => onResetVolume()}
        >
          <VolumeX className="stroke-red-900" />
        </button>
      )}
      {volume > 0 && volume <= 0.33 && (
        <button
          className="rounded-full hover:bg-blue-300/70 focus-visible:bg-blue-300/70 p-1"
          onClick={() => onMuteVolume()}
        >
          <Volume className="stroke-blue-900" />
        </button>
      )}
      {volume > 0.33 && volume <= 0.66 && (
        <button
          className="rounded-full hover:bg-blue-300/70 focus-visible:bg-blue-300/70 p-1"
          onClick={() => onMuteVolume()}
        >
          <Volume1 className="stroke-blue-900" />
        </button>
      )}
      {volume > 0.66 && (
        <button
          className="rounded-full hover:bg-blue-300/70 focus-visible:bg-blue-300/70 p-1"
          onClick={() => onMuteVolume()}
        >
          <Volume2 className="stroke-blue-900" />
        </button>
      )}
      <Slider
        defaultValue={[volume]}
        value={[volume]}
        max={1}
        step={0.02}
        onValueChange={(value) => onVolumechange(value)}
      />
    </div>
  )
}
