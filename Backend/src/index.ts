import { createServer } from 'http'
import { Server } from 'socket.io'
import {
  ClientToServerEvents,
  InterServerEvents,
  ServerToClientEvents,
  SocketData,
} from './types'

const httpServer = createServer((req, res) => {
  if (req.url === '/healthz') {
    console.log('Server is healthy')
    res.writeHead(200, { 'Content-Type': 'text/plain' })
    res.end('OK')
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' })
    res.end('Not Found')
  }
})

const io = new Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>(httpServer, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  socket.on('createMessage', (msg: string) => {
    io.to(socket.data.room).emit('message', msg)
  })

  socket.on('hostGame', (name: string, roomConfig) => {
    socket.data.room = roomConfig.id
    socket.join(roomConfig.id)
  })

  socket.on('joinGame', (name: string, roomId) => {
    socket.data.room = roomId
    socket.join(roomId)
  })

  io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`)
  })
})

httpServer.listen(6122, () => {
  console.log('Server is listening on port 6122')
})
