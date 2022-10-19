import { useState } from 'react'
import cloneDeep from 'lodash.clonedeep'

export function useRoom(serverRoom) {
    const [history, setHistory] = useState([serverRoom])
    const [room, setRoom] = useState(serverRoom)

    const updateRoom = (roomPartial, undo) => {
        if (window.controller) {
            window.controller.abort()
        }
        window.controller = new AbortController()
        window.signal = window.controller.signal

        const newRoom = { ...room, ...roomPartial }

        if (undo) {
            setHistory(history.slice(0, history.length - 1))
        } else {
            setHistory([...history, newRoom])
        }

        setRoom(newRoom)
        fetch('/api/update-room', {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(newRoom),
            signal: window.signal,
        })
    }

    const addList = () => {
        const id = room.lists.length + 1
        const newList = { id, name: `List ${id}`, tasks: [] }
        updateRoom({ lists: room.lists.concat(newList) })
    }

    const addTask = (listId, text) => {
        const newLists = cloneDeep(room.lists)
        const list = newLists.find((list) => list.id === listId)
        const id = list.tasks.length + 1
        const newTask = { id, text, checked: false }
        list.tasks.push(newTask)
        updateRoom({ lists: newLists })
    }

    const toggleTask = (listId, taskId) => {
        const newLists = cloneDeep(room.lists)
        const list = newLists.find((list) => list.id === listId)
        const task = list.tasks.find((task) => task.id === taskId)
        task.checked = !task.checked
        updateRoom({ lists: newLists })
    }

    const deleteTask = (listId, taskId) => {
        const newLists = cloneDeep(room.lists)
        const list = newLists.find((list) => list.id === listId)
        list.tasks = list.tasks.filter((task) => task.id !== taskId)
        updateRoom({ lists: newLists })
    }

    const undo = () => {
        const previousRoom = history[history.length - 2]
        updateRoom(previousRoom, true)
    }

    return {
        invalidRoom: !room,
        lists: room?.lists,
        canUndo: history.length > 1,
        addList,
        addTask,
        toggleTask,
        deleteTask,
        undo,
        setRoom,
    }
}
