import cache from 'memory-cache'
import shortid from 'shortid'

export default function handler(req, res) {
    shortid.characters('0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$@')
    const roomId = shortid.generate()
    cache.put(roomId, { id: roomId, lists: [] })
    res.status(200).json({ roomId })
}
