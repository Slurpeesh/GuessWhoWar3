import ConnectionManager from '@/widgets/ConnectionManager'
import ConnectionState from '@/widgets/ConnectionState'
import Messages from '@/widgets/Messages'
import MyForm from '@/widgets/MyForm'

export default function Dev() {
  return (
    <>
      <ConnectionState />
      <Messages />
      <ConnectionManager />
      <MyForm />
    </>
  )
}
