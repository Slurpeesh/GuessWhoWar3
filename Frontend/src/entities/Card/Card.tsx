import { cn } from '@/app/lib/utils'
import { HTMLAttributes } from 'react'

interface ICard
  extends React.DetailedHTMLProps<
    HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  className?: string
}

export default function Card({ className, children, ...rest }: ICard) {
  return (
    <div
      className={cn(
        'relative shadow-md rounded-lg overflow-hidden p-2',
        className
      )}
      {...rest}
    >
      <div className="absolute bg-accent/30 backdrop-blur-sm top-0 left-0 w-full h-full"></div>
      {children}
    </div>
  )
}
