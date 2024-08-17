import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import images from '@/app/lib/imgs'
import { cn } from '@/app/lib/utils'
import { setUnitChosen } from '@/app/store/slices/unitChosenSlice'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/entities/ToggleGroup/ToggleGroup'

export default function UnitToggleGroup() {
  const unitChosen = useAppSelector((state) => state.unitChosen.value)
  const dispatch = useAppDispatch()

  function onUnitChange(value: string) {
    dispatch(setUnitChosen(value))
  }

  return (
    <div>
      <ToggleGroup
        type="single"
        className="flex flex-wrap"
        value={unitChosen}
        onValueChange={(value) => onUnitChange(value)}
      >
        {Object.keys(images).map((imageKey, index) => (
          <ToggleGroupItem value={imageKey} className="w-16 h-16 p-0">
            <img
              className={cn('grayscale hover:grayscale-0', {
                'grayscale-0 animate-border-glow': imageKey === unitChosen,
              })}
              key={index}
              src={images[imageKey]}
              alt={imageKey}
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
