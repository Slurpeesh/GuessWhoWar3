import { socket } from '@/app/socket'

export default function ConnectionManager() {
  function connect() {
    socket.connect()
  }

  function disconnect() {
    socket.disconnect()
  }

  return (
    <>
      <button className="bg-green-500 rounded-xl p-2" onClick={connect}>
        Connect
      </button>
      <button className="bg-red-500 rounded-xl p-2" onClick={disconnect}>
        Disconnect
      </button>
    </>
  )
}
