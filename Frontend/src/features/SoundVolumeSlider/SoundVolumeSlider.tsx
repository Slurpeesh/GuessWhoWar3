import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { cn } from '@/app/lib/utils'
import { setVolume } from '@/app/store/slices/volumeSlice'
import { Slider } from '@/shared/Slider/Slider'
import { Volume2 } from 'lucide-react'

interface ISoundVolumeSlider {
  className?: string
}

export default function SoundVolumeSlider({ className }: ISoundVolumeSlider) {
  const volume = useAppSelector((state) => state.volume.value)
  const dispatch = useAppDispatch()
  function onVolumechange(value: Array<number>) {
    dispatch(setVolume(value[0]))
  }
  return (
    <div className={cn('flex gap-2', className)}>
      <Volume2 className="stroke-blue-900" />
      <Slider
        defaultValue={[volume]}
        max={1}
        step={0.02}
        onValueChange={(value) => onVolumechange(value)}
      />
    </div>
  )
}
