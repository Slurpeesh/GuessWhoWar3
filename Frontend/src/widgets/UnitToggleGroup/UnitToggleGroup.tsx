import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import images from '@/app/lib/imgs'
import { cn } from '@/app/lib/utils'
import { setChosenUnit } from '@/app/store/slices/roundSlice'
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/entities/ToggleGroup/ToggleGroup'

export default function UnitToggleGroup() {
  const round = useAppSelector((state) => state.round.value)
  const dispatch = useAppDispatch()

  function onUnitChange(value: string) {
    dispatch(setChosenUnit(value))
  }

  return (
    <div>
      <ToggleGroup
        type="single"
        className="flex flex-wrap"
        value={round.chosenUnit}
        onValueChange={(value) => onUnitChange(value)}
      >
        {Object.keys(images).map((imageKey, index) => (
          <ToggleGroupItem
            key={index}
            value={imageKey}
            className="w-16 h-16 p-0"
          >
            <img
              className={cn('grayscale hover:grayscale-0', {
                'grayscale-0 animate-border-glow':
                  imageKey === round.chosenUnit,
              })}
              src={images[imageKey]}
              alt={imageKey}
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  )
}
