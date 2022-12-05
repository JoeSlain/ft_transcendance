import { useContext, useEffect } from 'react'
import axios from 'axios'
import { ChatContext } from '../context/socketContext'

const Redirect = () => {
    const socket = useContext(ChatContext)

    useEffect(() => {
        axios
            .get(`http://localhost:3001/api/users`, {
                withCredentials: true
            })
            .then(response => {
                console.log('getting profile from api')
                socket.emit('login', response.data)
            })
    }, [])

    return (<div></div>)
}

export default Redirect;