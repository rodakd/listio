import cache from 'memory-cache'
import styles from '../../styles/Room.module.css'
import io from 'socket.io-client'

import { ActionIcon, Button, Checkbox, Text, TextInput } from '@mantine/core'
import { useRoom } from '../../hooks/useRoom'
import { useInputState } from '@mantine/hooks'
import { RiSendPlane2Line, RiDeleteBin6Line } from 'react-icons/ri'
import { useEffect } from 'react'

export default function Room({ serverRoom }) {
    const { invalidRoom, lists, canUndo, addList, addTask, deleteTask, toggleTask, undo, setRoom } = useRoom(serverRoom)

    useEffect(() => {
        initSocket()
    }, [])

    const initSocket = async () => {
        if (!serverRoom) {
            return
        }

        await fetch('/api/socket')
        const socket = io()
        socket.emit('join', serverRoom.id)
        socket.on('roomUpdated', setRoom)
    }

    if (invalidRoom) {
        return <div>Invalid room</div>
    }

    return (
        <div className={styles.room}>
            {lists.map((list) => (
                <List key={list.id} list={list} addTask={addTask} deleteTask={deleteTask} toggleTask={toggleTask} />
            ))}
            <Button className={styles.addListBtn} onClick={addList}>
                Add List
            </Button>
            <Button disabled={!canUndo} className={styles.undoBtn} onClick={undo}>
                Undo
            </Button>
        </div>
    )
}

export function List({ list, addTask, deleteTask, toggleTask }) {
    const [text, setText] = useInputState('')

    const handleAddTask = () => {
        if (text) {
            addTask(list.id, text)
            setText('')
        }
    }

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleAddTask()
        }
    }

    return (
        <div className={styles.list}>
            <Text className={styles.listName}>{list.name}</Text>
            <div className={styles.taskList}>
                {list.tasks.map((task) => (
                    <div key={task.id} className={styles.task}>
                        <Checkbox
                            checked={task.checked}
                            size={35}
                            label={task.text}
                            onChange={() => toggleTask(list.id, task.id)}
                        />
                        <ActionIcon onClick={() => deleteTask(list.id, task.id)}>
                            <RiDeleteBin6Line size={24} />
                        </ActionIcon>
                    </div>
                ))}
            </div>
            <div className={styles.inputWrapper}>
                <TextInput value={text} onChange={setText} onKeyDown={handleInputKeyDown} className={styles.input} />
                <ActionIcon onClick={handleAddTask}>
                    <RiSendPlane2Line size={24} />
                </ActionIcon>
            </div>
        </div>
    )
}

export function getServerSideProps(context) {
    const serverRoom = cache.get(context.params.roomId)
    return {
        props: { serverRoom },
    }
}
