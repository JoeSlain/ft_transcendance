import axios from "axios"
import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
import ReactCodeInput from 'react-code-input'

const ProfilePage = ({ user, setUser }) => {
    const params = useParams();
    const [qrcode, setQrCode] = useState('');
    const [code, setCode] = useState('');

    // generate 2fa qr code
    async function generate2fa() {
        const res = await fetch('http://localhost:3001/api/auth/2fa/generate', {
            method: 'POST', credentials: 'include'
        })
        const blob = await res.blob()
        setQrCode(URL.createObjectURL(blob))
    }

    // get 2fa code
    const getCode = (code) => {
        console.log(code)
        setCode(code)
    }

    const get2faCode = (event) => {
        event.preventDefault()
        axios
            .post('http://localhost:3001/api/auth/2fa/turn-on', {
                twoFactorAuthenticationCode: code
            }, {
                withCredentials: true
            })
            .then(response => console.log(response))
    }

    const send2faCode = (event) => {
        event.preventDefault()
        axios
            .post('http://localhost:3001/api/auth/2fa/authenticate', {
                twoFactorAuthenticationCode: code
            }, {
                withCredentials: true
            })
            .then (response => console.log(response))
    }


    useEffect(() => {
        axios
            .get(`http://localhost:3001/api/users/${params.id}`, {
                withCredentials: true
            })
            .then(response => {
                console.log(response.data)
                setUser(response.data)
            })
    }, [])

    if (user.isTwoFactorAuthenticationEnabled) {
        return (
            <div>
                <p> Enter code from GoogleAuthenticator app </p>
                <form onSubmit={send2faCode}>
                    <ReactCodeInput type='text' fields={6} onChange={getCode} />
                    <button type="submit"> confirm </button>
                </form>
            </div>
        )
    }

    return (
        <div>
            <h1>
                Welcome {user.username} !
            </h1>
            <p>
                Your winratio is {user.winratio}
                (W: {user.n_win}, L: {user.n_lose})
            </p>
            <p>
                Your avatar url is {user.profile_pic}
            </p>
            <button onClick={generate2fa}> activate 2fa </button>
            <p>
                <img src={qrcode} />
            </p>
            <form onSubmit={get2faCode}>
                <ReactCodeInput type='text' fields={6} onChange={getCode} />
                <button type="submit"> confirm </button>
            </form>
        </div>
    )
}

export default ProfilePage;