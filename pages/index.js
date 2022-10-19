import { Button, Text } from '@mantine/core'
import { useState } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Index.module.css'

export default function Home() {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const createNewList = async () => {
        setError('')
        setIsLoading(true)
        const response = await fetch('/listio/api/create-room')
        const { roomId } = await response.json().catch(() => ({}))
        if (!roomId) {
            setError('Failed to create a room')
            return setIsLoading(false)
        }
        router.push(`room/${roomId}`)
    }

    return (
        <div className={styles.index}>
            <Button loading={isLoading} onClick={createNewList}>
                Create Room
            </Button>
            <Text className={styles.error}>{error}</Text>
        </div>
    )
}
