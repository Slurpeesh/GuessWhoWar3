import ConnectionManager from '@/widgets/ConnectionManager'
import ConnectionState from '@/widgets/ConnectionState'
import Messages from '@/widgets/Messages'
import MyForm from '@/widgets/MyForm'

export default function Dev() {
  return (
    <div className="absolute z-50 bottom-0 left-0">
      <ConnectionState />
      <Messages />
      <ConnectionManager />
      <MyForm />
    </div>
  )
}
