import axios from "axios";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { SocketContext } from "../context/socketContext";
import { getSocketId, getStorageItem, getUserId, saveStorageItem } from "../storage/localStorage";

const LoginPage = ({ user, setUser }) => {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const handleClick = (event) => {
        event.preventDefault();
        window.top.location = 'http://localhost:3001/api/auth/login'
    }

    const handleDevLogin = () => {
        axios
            .post('http://localhost:3001/api/auth/devlog', {
                username: 'test1',
                password: 'password'
            }, { withCredentials: true })
            .then(response => {
                setUser(response.data)
                localStorage.setItem('user', JSON.stringify(response.data))
                console.log('devlog user', response.data)
                //socket.connect()
                socket.userId = response.data.id
                console.log('userSocketId', socket.id)
                socket.emit('login', {
                    user: response.data,
                    socketId: socket.id,
                    status: 'online'
                })
                console.log('saved socket id', socket.id)
                /*console.log('myid', socket.id)

                console.log('login id', socket.id)*/
                navigate('/profile')
            })
    }

    return (
        <div className='LoginPage' >
            <p> Welcome to 42Pong ! </p>
            <button onClick={handleClick} > 42 auth </button>
            <button onClick={handleDevLogin}> Dev login </button>
        </div>
    )
}

export default LoginPage