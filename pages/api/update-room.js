import cache from 'memory-cache'

export default function handler(req, res) {
    const room = req.body
    const roomExists = !!cache.get(room?.id)

    if (!roomExists) {
        return res.status(400).json({ error: 'Invalid room' })
    }

    cache.put(room.id, room)
    res.socket.server.io.to(room.id).emit('roomUpdated', room)
    res.status(200).json()
}
