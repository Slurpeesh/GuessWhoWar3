import { createServer } from 'http'
import path from 'path'
import { Server } from 'socket.io'
import { getAudioFiles } from './soundsSrcs'
import {
  ClientToServerEvents,
  InterServerEvents,
  IRoomsMapValue,
  ServerToClientEvents,
  SocketData,
} from './types'

const directoryPath = path.join(__dirname, '../assets/sounds/')

getAudioFiles(directoryPath)
  .then((audioFiles) => {
    console.log('Audio files:', audioFiles)
  })
  .catch((error) => {
    console.error('Error reading directory:', error)
  })

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

const rooms: Map<string, IRoomsMapValue> = new Map()

io.on('connection', (socket) => {
  socket.on('createMessage', (msg: string) => {
    io.to(socket.data.room).emit('message', msg)
  })

  socket.on('hostGame', (name: string, roomConfig) => {
    if (rooms.has(roomConfig.id)) {
      socket.emit('roomExists')
    } else {
      rooms.set(roomConfig.id, {
        clients: [{ id: socket.id, name, role: 'host' }],
        rounds: roomConfig.rounds,
        maxPlayers: roomConfig.maxPlayers,
      })
      socket.data.room = roomConfig.id
      const clients = rooms.get(roomConfig.id)!.clients
      socket.join(roomConfig.id)
      io.to(roomConfig.id).emit('playerData', clients)
      socket.emit('stageConfirm', 'lobby')
    }
  })

  socket.on('joinGame', (name: string, roomId) => {
    if (!rooms.has(roomId)) {
      socket.emit('noSuchRoom')
    } else {
      const room = rooms.get(roomId) as IRoomsMapValue
      const clients = room.clients
      const maxPlayers = room.maxPlayers
      if (clients.length === maxPlayers) {
        socket.emit('roomIsFull')
        return
      }
      const rounds = room.rounds
      clients.push({ id: socket.id, name, role: 'player' })
      socket.data.room = roomId
      socket.join(roomId)
      io.to(roomId).emit('playerData', clients)
      io.to(roomId).emit('roomConfig', { id: roomId, maxPlayers, rounds })
      socket.emit('stageConfirm', 'lobby')
    }
  })

  socket.on('leaveLobby', (userId: string, role) => {
    const roomId = socket.data.room
    if (role === 'host') {
      io.to(roomId).emit('playerData', [])
      io.in(roomId).socketsLeave(roomId)
      rooms.delete(roomId)
    } else {
      let clients = rooms.get(roomId)!.clients
      rooms.get(roomId)!.clients = clients.filter((client) => {
        if (client) return client.id !== userId
      })
      clients = rooms.get(roomId)!.clients
      io.to(roomId).emit('playerData', clients)
      socket.emit('playerData', [])
      socket.leave(roomId)
    }
    socket.data.room = socket.id
  })

  socket.on('startGame', () => {
    const roomId = socket.data.room
    io.to(roomId).emit('gameStarted')
  })

  socket.on('getSoundForRound', () => {
    console.log('Sound for round')
  })
})

httpServer.listen(6122, () => {
  console.log('Server is listening on port 6122')
})
