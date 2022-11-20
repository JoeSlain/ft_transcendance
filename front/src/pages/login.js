import axios from "axios";
import { Navigate } from 'react-router-dom'

const LoginPage = ({ user, setUser }) => {
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
                localStorage.setItem('user', JSON.stringify(user))
                console.log('devlog user', user)
            })
    }
    console.log('logged user', user)

    return (
        <div className='LoginPage' >
            {user && <Navigate to="/profile" replace='true' />}
            <p> Welcome to 42Pong ! </p>
            <button onClick={handleClick} > 42 auth </button>
            <button onClick={handleDevLogin}> Dev login </button>
        </div>
    )
}

export default LoginPage