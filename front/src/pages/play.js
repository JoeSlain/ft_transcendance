import '../styles/play.css'
import { useContext, useEffect, useState } from 'react'
import Friend from './friend'
import { UserContext } from '../context/userContext'
import { GameContext } from '../context/socketContext'
import { getStorageItem } from '../storage/localStorage'
import { Socket } from 'socket.io-client'
import { saveStorageItem } from '../storage/localStorage'
import { GameReadyStyle, ReadyStyle } from '../styles/statuses'

const GetReady = ({ ready }) => {
    if (ready)
        return <ReadyStyle color='green'> ✓ </ReadyStyle>
    return <ReadyStyle color='red'> x </ReadyStyle>
}

const PlayerEntry = ({ player, ready, setReady }) => {
    return (
        <div className='playerEntry'>
            <h2>
                {`${player.infos.username} `}
                <GetReady ready={ready} />
            </h2>
            <button onClick={() => setReady(!ready)}> Ready </button>
        </div>
    )
}

const Play = () => {
    const socket = useContext(GameContext)
    const me = useContext(UserContext)
    const [hostReady, setHostReady] = useState(false)
    const [guestReady, setGuestReady] = useState(false)
    const [room, setRoom] = useState(getStorageItem('room'))

    useEffect(() => {
        if (!room)
            socket.emit('createRoom', me)

        socket.on('createdRoom', data => {
            setRoom(data)
            saveStorageItem('room', data)
        })

        socket.on('joinedRoomFailure', data => {
            console.log(`failed to join room : ${data}`)
        })

        socket.on('joinedRoom', data => {
            setRoom(data)
        })

        return () => {
            socket.off('room created')
            socket.off('room joined')
        }
    }, [])

    const searchOpponent = () => {

    }

    const startGame = () => {

    }

    if (room) {
        return (
            <div className='play'>
                <div className='playHeader'>
                    <h1> {room.host.infos.username}'s room </h1>
                </div>
                <div className='playBody'>
                    <PlayerEntry player={room.host} ready={hostReady} setReady={setHostReady} />
                    {room.guest &&
                        <PlayerEntry player={room.guest} ready={guestReady} setReady={setGuestReady} />
                    }
                </div>

                <div className='playFooter'>
                    {room.guest
                        ? <button onClick={startGame}> Start </button>
                        : <button onClick={searchOpponent}> Search opponent </button>
                    }
                </div>
            </div >
        )
    }
}

export default Play;