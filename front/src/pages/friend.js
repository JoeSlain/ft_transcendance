import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { ContextMenu } from '../styles/menus'
import UserEntry from '../components/userEntry'
import { SocketContext } from '../context/socketContext'

const Friend = () => {
    const [name, setName] = useState('')
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
                console.log('new axios request')
                console.log('response', response.data)
                console.log('friends', friends)
                if (friends.toString() !== response.data.toString())
                    setFriends(friends.concat(response.data))
            })

        // socket listener
        socket.on('new_client', data => {
            console.log('new client event')
            const newArr = friends.map(friend => {
                console.log('friend id', friend.id)
                if (friend.id === data.userId) {
                    console.log('friend found')
                    if (friend.status !== data.status) {
                        console.log(`changing friend status to ${data.status}`)
                        return { ...friend, status: data.status }
                    }
                    else
                        console.log('friend status unchanged')
                }
                return friend
            })
            if (newArr !== friends) {
                console.log('setting new friend array after io')
                setFriends(newArr)
            }
        })

        return () => {
            window.removeEventListener('click', handleClick)
            socket.off('new_client')
        }
    }, [friends])

    const addFriend = (e) => {
        e.preventDefault()

        if (name === '' || friends.find(user => user.username === name)) {
            console.log('invalid username')
            setName('')
            return;
        }
        axios
            .post('http://localhost:3001/api/users/friend', { username: name }, {
                withCredentials: true
            })
            .then(response => {
                if (response.data) {
                    setFriends(friends.concat(response.data))
                    console.log('response', response.data)
                }
                else
                    console.log('user not found')
            })
        setName('')
    }

    const handleNewName = (e) => {
        setName(e.target.value)
    }

    const handleInvite = (user) => {
        console.log(`user ${user.username} invited`)
        console.log(`user status is ${user.status}`)
    }

    const handleDelete = (user) => {
        console.log(`user ${user.username} deleted`)
    }

    return (
        <div>
            <h2> Friends </h2>
            <form onSubmit={addFriend} >
                <div className="form">
                    <div className="form_input">
                        <input
                            value={name}
                            onChange={handleNewName}
                        />
                    </div>
                    <button type="submit"> + </button>
                </div>
            </form>
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