import { Server } from 'socket.io'

export default async function SocketHandler(_, res) {
    if (res.socket.server.io) {
        res.end()
        return
    }

    const io = new Server(res.socket.server)
    res.socket.server.io = io

    io.on('connection', (socket) => {
        socket.on('join', (roomId) => {
            socket.join(roomId)
        })
    })

    res.end()
}
