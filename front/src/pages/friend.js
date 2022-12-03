import { useContext, useEffect, useState } from 'react'
import { ContextMenu } from '../styles/menus'
import { ChatContext } from '../context/socketContext'
import axios from 'axios'

import UserEntry from '../components/userEntry'
import AddFriend from '../components/addFriend'
import { UserContext } from '../context/userContext'

const Friend = ({ setNotifs }) => {
    const [friends, setFriends] = useState([])
    const [statuses, setStatuses] = useState(new Map())
    const [show, setShow] = useState(false)
    const [points, setPoints] = useState({ x: 0, y: 0 })
    const [clicked, setClicked] = useState({})
    const socket = useContext(ChatContext);
    const me = useContext(UserContext);

    useEffect(() => {
        const handleClick = () => setShow(false)
        socket.emit('getFriends', me);

        // window listener
        window.addEventListener('click', handleClick)

        // get friends
        console.log('get friends axios')
        socket.on('friends', data => {
            console.log('friends', data.friends)
            setFriends(data.friends)
            setStatuses(new Map(JSON.parse(data.statuses)))
        })
        /*axios
            .get('http://localhost:3001/api/users/friends', {
                withCredentials: true
            })
            .then(response => {
                setFriends(friends.concat(response.data))
                console.log('friends in axios', response.data)
            })*/

        // new friend
        socket.on('newFriend', data => {
            console.log('newFriendEvent')
            console.log(`adding friend ${data}`)
            setFriends(prev => [...prev, data])
            setStatuses(prev => new Map(prev.set(data, 'online')))
        })

        // update friend status
        socket.on('updateStatus', data => {
            console.log('friend update', data.user)
            console.log('statuses', statuses)
            setStatuses(prev => {
                if (prev.has(data.user.id)) {
                    console.log('user found, changing status')
                    return new Map(prev.set(data.user.id, data.status))
                }
                else {
                    console.log('user not found, status unchanged')
                    return prev
                }
            })
        })

// notif received
socket.on('notified', data => {
    console.log('invitation received')
    if (data.from.id !== me.id) {
        console.log(`${data.from.username} invited you`)
        console.log('accept event', data.acceptEvent)
        console.log('decline event', data.declineEvent)
        setNotifs(prev => [...prev, data])
    }
})

// friend deleted
socket.on('friendDeleted', data => {
    console.log(`deleting ${data.username}`)
    setFriends(prev => prev.filter(friend => friend.id !== data.id))
})

// unmount
return () => {
    window.removeEventListener('click', handleClick)
    socket.off('friends')
    socket.off('newFriend')
    socket.off('updateStatus')
    socket.off('notified')
    socket.off('friendDeleted')
}
    }, [])

const handleInvite = (user) => {
    const data = {
        header: 'Game Invite',
        body: `${me.username} invited you to play a game`,
        accept: 'Accept',
        decline: 'Decline',
        from: me,
        to: user,
        acceptEvent: 'acceptInvite',
        declineEvent: 'declineInvite',
    }
    console.log('data', data)
    socket.emit('notif', data)
}

const handleDelete = (user) => {
    const data = {
        header: 'Delete friend',
        body: `Remove ${user.username} from your friendlist ?`,
        accept: 'Yes',
        decline: 'No',
        from: me,
        to: user,
        acceptEvent: 'deleteFriend'
    }
    setNotifs(prev => [...prev, data])
}

return (
    <div>
        <AddFriend
            friends={friends}
            setFriends={setFriends}
            me={me}
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
                        <UserEntry user={user} status={statuses.get(user.id)} show={show} />
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