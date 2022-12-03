import axios from "axios";
import { useContext, useState } from "react";
import { ChatContext } from "../context/socketContext";

const LoginPage = () => {
    const socket = useContext(ChatContext);
    const [devlog, setDevLog] = useState(false)
    const [username, setUsername] = useState('')

    const handleClick = (event) => {
        event.preventDefault();
        window.top.location = 'http://localhost:3001/api/auth/login'
    }

    const handleDevLogin = (e) => {
        e.preventDefault();

        axios
            .post('http://localhost:3001/api/auth/devlog', {
                username,
                password: 'password'
            }, { withCredentials: true })
            .then(response => {
                console.log('dev login')
                socket.emit('login', {
                    user: response.data,
                })
            })
    }

    if (devlog) {
        return (
            <form onSubmit={handleDevLogin} >
                <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <button type='submit'> Connect </button>
                <button onClick={() => { 
                    setUsername('')
                    setDevLog(false)
                }}> 
                    Cancel
                </button>
            </form>
        )
    }
    else {
        return (
            <div className='LoginPage' >
                <p> Welcome to 42Pong ! </p>
                <button onClick={handleClick} > 42 auth </button>
                <button onClick={() => setDevLog(true)}> Dev login </button>
            </div>
        )
    }
}

export default LoginPage