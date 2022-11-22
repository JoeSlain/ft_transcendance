import axios from 'axios'
import {useState} from 'react'

const AddFriend = ({friends, setFriends}) => {
    const [name, setName] = useState('')

    const addFriend = (e) => {
        e.preventDefault()

        if (name === '' 
        || name === (JSON.parse(localStorage.getItem('user'))).username
        || friends.find(user => user.username === name)
        ) {
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