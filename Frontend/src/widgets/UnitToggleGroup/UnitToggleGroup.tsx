import { useAppDispatch, useAppSelector } from '@/app/hooks/useActions'
import { imagesUnits } from '@/app/lib/imgs'
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
    <div className="relative z-10">
      <ToggleGroup
        type="single"
        className="flex flex-wrap"
        value={round.chosenUnit}
        onValueChange={(value) => onUnitChange(value)}
      >
        {Object.keys(imagesUnits).map((imageKey, index) => {
          const value = imageKey.match(
            /(Alliance|Neutral|Undead|Horde|NightElf)(\w*)/
          )[2]
          return (
            <ToggleGroupItem
              key={index}
              value={value}
              className="w-16 h-16 p-0"
            >
              <img
                className={cn('grayscale hover:grayscale-0', {
                  'grayscale-0 animate-border-glow': value === round.chosenUnit,
                  'grayscale-0 scale-125 transition-transform relative z-10 outline-none ring-4 ring-green-400':
                    value === round.rightAnswer,
                })}
                src={imagesUnits[imageKey]}
                alt={value}
              />
            </ToggleGroupItem>
          )
        })}
      </ToggleGroup>
    </div>
  )
}
