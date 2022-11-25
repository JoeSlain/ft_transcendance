import axios from 'axios'
import {useContext, useEffect, useState} from 'react'
import { SocketContext } from '../context/socketContext'

const AddFriend = ({me, friends, setFriends}) => {
    const [name, setName] = useState('')
    const socket = useContext(SocketContext)

    console.log('friends in addfriend', friends)

    /*useEffect(() => {
        socket.on('newFriend', friend => {
            console.log('newFriendEvent')
            console.log('friends b4', friends)
            setFriends(friends.concat(friend))
            console.log('friends af', friends)
        })
        return () => {
            socket.off('newFriend')
        }
    }, [])*/

    const notify = (user) => {
        const msg = {
            header: 'Friend Request',
            body: `${me.username} wants to be your friend`,
            accept: 'Accept',
            decline: 'Decline'
        }
        const data = {
            msg,
            from: me,
            to: user,
            acceptEvent: 'acceptFriendRequest',
        }
        console.log('data', data)
        socket.emit('notif', data)
    }

    const addFriend = (e) => {
        e.preventDefault()

        if (name === '' 
        || name === me.username
        || friends.find(friend => friend.username === name)
        ) {
            console.log('invalid username')
            setName('')
            return;
        }
        axios
            .get(`http://localhost:3001/api/users/username/${name}`, {
                withCredentials: true
            })
            .then(response => {
                if (response.data && response.data.status === 'online')
                    notify(response.data)
            })
        /*axios
            .post('http://localhost:3001/api/users/addFriend', { username: name }, {
                withCredentials: true
            })
            .then(response => {
                if (response.data) {
                    setFriends(friends.concat(response.data))
                    console.log('response', response.data)
                }
                else
                    console.log('user not found')
            })*/
        setName('')
    }

    const handleNewName = (e) => {
        setName(e.target.value)
    }

    return (
        <div className='addFriend'>
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
        </div>
    )
}

export default AddFriend;