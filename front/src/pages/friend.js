import { useEffect, useState } from 'react'
import axios from 'axios'

const Friend = () => {
    const [name, setName] = useState('')
    const [users, setUsers] = useState([])

    useEffect(() => {
        axios
            .get('http://localhost:3001/api/users/friends', {
                withCredentials: true
            })
            .then(response => {
                console.log(response.data)
                setUsers(users.concat(response.data))
            })
    }, [])

    const addFriend = (e) => {
        e.preventDefault()

        axios
            .post('http://localhost:3001/api/users/friend', { username: name }, {
                withCredentials: true
            })
            .then(response => {
                setUsers(users.concat(response.data))
                console.log('response', response.data)
            })
        setName('')
    }

    const handleNewName = (e) => {
        setName(e.target.value)
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
            {users &&
                <div className='userList'>
                    {users.map(user => 
                        <div className='userEntry' key={user.username}>
                            {user.username}
                        </div>)
                    }
                </div>
            }
        </div>
    )
}

export default Friend;