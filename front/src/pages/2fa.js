import axios from 'axios'
import { useState } from 'react'
import ReactCodeInput from 'react-code-input'
import { Navigate } from 'react-router-dom'

const TwoFa = () => {
    const [code, setCode] = useState('');
    const [url, setUrl] = useState('');

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
            <p> Enter code from GoogleAuthenticator app </p>
            <form onSubmit={send2faCode}>
                <ReactCodeInput type='text' fields={6} onChange={getCode} />
                <button type="submit"> confirm </button>
            </form>
        </div>
    )
}

export default TwoFa