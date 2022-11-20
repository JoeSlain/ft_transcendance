import axios from 'axios'
import { useState, useEffect } from 'react'
import ReactCodeInput from 'react-code-input'
import { Navigate } from 'react-router-dom'

const AuthCode = () => {
    const [url, setUrl] = useState('');
    const [code, setCode] = useState('');

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
                setUrl(`/profile/${response.data.id}`)
            })
    }

    return (
        <div>
            {
                url && <Navigate to={url} replace={true} />
            }
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

const TwoFa = ({ user, setUser }) => {
    useEffect(() => {
        axios
            .get(`http://localhost:3001/api/users`, {
                withCredentials: true
            })
            .then(response => {
                console.log('getting profile from api')
                setUser(response.data)
                localStorage.setItem('user', JSON.stringify(user))
            })
    }, [])

    console.log('2fa user', user)

    if (user && user.isTwoFactorAuthenticationEnabled)
        return (<AuthCode />)
    if (user)
        return ( <Navigate to='/profile' replace /> )
}

export default TwoFa