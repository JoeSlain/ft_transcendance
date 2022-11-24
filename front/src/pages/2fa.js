import axios from 'axios'
import { useContext, useState } from 'react'
import ReactCodeInput from 'react-code-input'
import { useNavigate } from 'react-router-dom'
import { SocketContext } from '../context/socketContext'
import { getStorageItem, getUserId, saveStorageItem } from '../storage/localStorage'

const TwoFa = ({user, setUser}) => {
    const [code, setCode] = useState('');
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    const getCode = (code) => {
        console.log(code)
        setCode(code)
    }

    const send2faCode = (event) => {
        event.preventDefault()
        axios
            .post('http://localhost:3001/api/auth/2fa/authenticate', {
                twoFactorAuthenticationCode: code
            }, {
                withCredentials: true
            })
            .then(response => {
                console.log(response.data)
                setUser(response.data)
                console.log('2fa user', user)
                localStorage.setItem('user', JSON.stringify(response.data))
                socket.connect()
                socket.emit('updateStatus', {
                    userId: response.data.id,
                    socketId: socket.id,
                    status: 'online'
                })
                saveStorageItem('socketId', {socketId: socket.id})
                navigate(`/profile`)
            })
    }

    return (
        <div>
            {
                <div>
                    <p> Enter code from GoogleAuthenticator app </p>
                    <form onSubmit={send2faCode}>
                        <ReactCodeInput type='text' fields={6} onChange={getCode} />
                        <button type="submit"> confirm </button>
                    </form>
                </div>
            }
        </div>
    )
}

export default TwoFa