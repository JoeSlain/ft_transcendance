import axios from "axios"
import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
import { Navigate } from 'react-router-dom'

const ProfilePage = ({ user, setUser }) => {
    const [url, setUrl] = useState('')
    const params = useParams();

    return (
        <div>
            {url && <Navigate to="/params" replace='true' />}

            <button onClick={() => setUrl('http://localhost:3000/params')}> Params </button>
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
        </div>
    )
}

export default ProfilePage;