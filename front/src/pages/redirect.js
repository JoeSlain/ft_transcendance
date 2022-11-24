import {useContext, useEffect} from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router'
import { SocketContext } from '../context/socketContext'
import { getUserId, saveStorageItem } from '../storage/localStorage'

const Redirect = ({ user, setUser }) => {
    const navigate = useNavigate()
    const socket = useContext(SocketContext)

    useEffect(() => {
        axios
            .get(`http://localhost:3001/api/users`, {
                withCredentials: true
            })
            .then(response => {
                console.log('getting profile from api')
                console.log('user response data', response.data)
                setUser(response.data)
                localStorage.setItem('user', JSON.stringify(response.data))
                console.log('2fa ls user', JSON.parse(localStorage.getItem('user')))
                socket.userId = response.data.id
                console.log('userSocketId', socket.id)
                socket.emit('login', {
                    user: response.data,
                    socketId: socket.id,
                    status: 'online'
                })
                navigate('/profile')
            })
    }, [])

    return (<div></div>)
}

export default Redirect;