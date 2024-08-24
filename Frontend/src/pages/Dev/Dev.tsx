import ConnectionManager from '@/widgets/ConnectionManager'
import ConnectionState from '@/widgets/ConnectionState'

export default function Dev() {
  return (
    <div className="absolute z-50 bottom-0 left-96">
      <ConnectionState />
      <ConnectionManager />
    </div>
  )
}
