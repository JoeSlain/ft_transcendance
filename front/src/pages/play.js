import '../styles/play.css'
import { useContext, useEffect, useState } from 'react'
import Friend from './friend'
import { UserContext } from '../context/userContext'
import { GameContext } from '../context/socketContext'
import { getStorageItem } from '../storage/localStorage'
import { Socket } from 'socket.io-client'
import { saveStorageItem } from '../storage/localStorage'

const Play = () => {
    const gameSocket = useContext(GameContext)
    const me = useContext(UserContext)
    const [room, setRoom] = useState(getStorageItem('room'))

    useEffect(() => {
        if (!room)
            gameSocket.emit('createRoom', me)

        gameSocket.on('createdRoom', data => {
            setRoom(data)
            saveStorageItem('room', data)
        })

        gameSocket.on('joinedRoom', data => {
            setRoom(data)
        })

        return () => {
            gameSocket.off('room created')
            gameSocket.off('room joined')
        }
    }, [])

    const searchOpponent = () => {

    }

    return (
        <div className='play'>
            <h1>ROOM </h1>

            <div className='footer'>
                <button onClick={searchOpponent}> Play </button>
            </div>
        </div >
    )
}

export default Play;