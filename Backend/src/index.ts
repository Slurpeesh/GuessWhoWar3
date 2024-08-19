import fs from 'fs'
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

const audioFiles = getAudioFiles(directoryPath)

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
        currentRound: { sound: '', answer: '' },
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

  socket.on('getSoundForRound', async () => {
    const roomId = socket.data.room
    let audioFilePath: string
    if (rooms.get(roomId)!.currentRound.sound) {
      audioFilePath = rooms.get(roomId)!.currentRound.sound
    } else {
      const sounds = await audioFiles
      const sound = sounds[Math.floor(Math.random() * sounds.length)]
      const match = sound.match(/([^\d\\]*)\d+\.mp3$/)
      if (match) {
        rooms.get(roomId)!.currentRound.answer = match[1]
      } else {
        throw Error('Wrong mp3 name')
      }
      audioFilePath = path.join(directoryPath, sound)
      rooms.get(roomId)!.currentRound.sound = audioFilePath
    }

    fs.readFile(audioFilePath, (err, data) => {
      if (err) {
        console.error('Error reading file:', err)
        return
      }
      io.to(roomId).emit('soundForRound', data)
    })
  })

  socket.on('roundAnswer', (answer: string) => {
    const roomId = socket.data.room
    const rightAnswer = rooms.get(roomId)!.currentRound.answer
    //FIXME: pay attention one line below!!! Backend and Frontend are linked with this path probably...
    // console.log(rooms.get(roomId)!.currentRound.sound)
    // console.log(rightAnswer)
    // console.log(answer)
    console.log('Answer for', socket.id, 'is:', answer.includes(rightAnswer))
  })
})

httpServer.listen(6122, () => {
  console.log('Server is listening on port 6122')
})
