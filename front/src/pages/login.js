import axios from "axios";
import { useContext } from "react";
import { useNavigate } from 'react-router-dom'
import { SocketContext } from "../context/socketContext";

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
            }, {withCredentials: true})
            .then(response => {
                setUser(response.data)
                localStorage.setItem('user', JSON.stringify(response.data))
                console.log('devlog user', response.data)
                socket.emit('updateStatus', {
                    userId: response.data.id,
                    socketId: socket.id,
                    status: 'online'
                })
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