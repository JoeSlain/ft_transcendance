import { useContext, useEffect, useState } from 'react'
import { ContextMenu } from '../styles/menus'
import { SocketContext } from '../context/socketContext'
import axios from 'axios'

import UserEntry from '../components/userEntry'
import AddFriend from '../components/addFriend'

const Friend = ({ me, setNotif }) => {
    const [friends, setFriends] = useState([])
    const [show, setShow] = useState(false)
    const [points, setPoints] = useState({ x: 0, y: 0 })
    const [clicked, setClicked] = useState({})
    const socket = useContext(SocketContext);

    useEffect(() => {
        const handleClick = () => setShow(false)

        // window listener
        window.addEventListener('click', handleClick)
        axios
            .get('http://localhost:3001/api/users/friends', {
                withCredentials: true
            })
            .then(response => {
                if (friends.toString() !== response.data.toString())
                    setFriends(friends.concat(response.data))
            })

        // socket listener
        socket.on('updateStatus', data => {
            console.log('friend', data.user)
            const newArr = friends.map(friend => {
                if (friend.id === data.user.id && friend.status !== data.status) {
                    return { ...friend, status: data.status }
                }
            /*    if (friend.id === data.user.id && friend !== data.user) {
                    return { ...friend, status: data.status }
                }*/
                return friend
            })
            if (newArr !== friends)
                setFriends(newArr)
        })

        socket.on('invited', data => {
            console.log('invitation received')
            if (data.from.id !== me.id) {
                console.log(`${data.from.username} invited you to play`)
                setNotif(data)
            }
        })

        // unmount
        return () => {
            window.removeEventListener('click', handleClick)
            socket.off('updateStatus')
            socket.off('invited')
        }
    }, [friends])

    const handleInvite = (user) => {
        const msg = {
            header: 'Game Invite',
            body: `${me.username} invited you to play a game`,
            acceptEvent: 'acceptInvite',
            declineEvent: 'declineInvite',
        }
        const data = {
            content: msg,
            from: me,
            to: user,
        }
        console.log('data', data)
        socket.emit('invite', data)
    }

    const handleDelete = (user) => {
        axios
            .post('http://localhost:3001/api/users/deleteFriend', {
                userId: user.id,
            }, {
                withCredentials: true,
            })
            .then(response => {
                console.log('friends after delete', response.data)
                if (response.data)
                    setFriends(response.data)
            })        
    }

    return (
        <div>
            <AddFriend friends={friends} setFriends={setFriends} />
            {friends &&
                <div className='userList'>
                    {friends.map(user =>
                        <div key={user.username} onContextMenu={(e) => {
                            e.preventDefault();
                            console.log(`${user.username} clicked`)
                            setShow(true)
                            setPoints({ x: e.pageX, y: e.pageY })
                            setClicked(user)
                        }}>
                            <UserEntry user={user} show={show} />
                        </div>
                    )}
                    {show && (
                        <ContextMenu top={points.y} left={points.x}>
                            <ul>
                                <li onClick={() => handleInvite(clicked)}> Invite </li>
                                <li> Block </li>
                                <li onClick={() => handleDelete(clicked)}> Delete </li>
                            </ul>
                        </ContextMenu>
                    )}
                </div>
            }
        </div>
    )
}

export default Friend;