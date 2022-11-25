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

        // get friends
        console.log('get friends axios')
        axios
            .get('http://localhost:3001/api/users/friends', {
                withCredentials: true
            })
            .then(response => {
                setFriends(friends.concat(response.data))
                console.log('friends in axios', response.data)
            })

        // new friend
        socket.on('newFriend', data => {
            console.log('data in new friend event', data)
            console.log('newFriendEvent')
            console.log('friends b4', friends)
            setFriends(friends.concat(data))
            console.log('friends af', friends)
        })

        // update friend status
        socket.on('updateStatus', data => {
            console.log('friend update', data.user)
            const newArr = friends.map(friend => {
                if (friend.id === data.user.id && friend.status !== data.status) {
                    return { ...friend, status: data.status }
                }
                /*    if (friend.id === data.user.id && friend !== data.user) {
                        return { ...friend, status: data.status }
                    }*/
                return friend
            })
            if (JSON.stringify(newArr) !== JSON.stringify(friends)) {
                console.log('friend status ok')
                setFriends(newArr)
            }
        })

        // notif received
        socket.on('notified', data => {
            console.log('invitation received')
            if (data.from.id !== me.id) {
                console.log(`${data.from.username} invited you`)
                console.log('accept event', data.acceptEvent)
                console.log('decline event', data.declineEvent)
                setNotif(data)
            }
        })

        // friend deleted
        socket.on('friendDeleted', data => {
            console.log(`deleting ${data.username}`)
            setFriends(friends.filter(friend => friend.id !== data.id))
        })

        // unmount
        return () => {
            window.removeEventListener('click', handleClick)
            socket.off('newFriend')
            socket.off('updateStatus')
            socket.off('notified')
            socket.off('friendDeleted')
        }
    }, [])

    const handleInvite = (user) => {
        const msg = {
            header: 'Game Invite',
            body: `${me.username} invited you to play a game`,
            accept: 'Accept',
            decline: 'Decline'
        }
        const data = {
            msg,
            from: me,
            to: user,
            acceptEvent: 'acceptInvite',
            declineEvent: 'declineInvite',
        }
        console.log('data', data)
        socket.emit('notif', data)
    }

    const handleDelete = (user) => {
        const msg = {
            header: 'Delete friend',
            body: `Remove ${user.username} from your friendlist ?`,
            accept: 'Yes',
            decline: 'No'
        }
        const data = {
            msg,
            from: me,
            to: user,
            acceptEvent: 'deleteFriend'
        }
        setNotif(data)
    }

    return (
        <div>
            <AddFriend
                friends={friends}
                setFriends={setFriends}
                me={me}
                setNotif={setNotif}
            />
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