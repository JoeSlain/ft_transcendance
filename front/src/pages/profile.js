import { useContext, useEffect, useState } from "react"
import { Navigate, useNavigate } from 'react-router-dom'
import { UserContext } from "../context/userContext"
import Params from './params'

const ProfilePage = ({ setUser }) => {
    const user = useContext(UserContext);
    const [params, setParams] = useState(false);
    const [url, setUrl] = useState(user.profile_pic);

    useEffect(() => {
        async function getAvatar() {
            const res = await fetch('http://localhost:3001/api/users/getAvatar', {
                method: 'GET', credentials: 'include'
            })
            const blob = await res.blob()
            setUrl(URL.createObjectURL(blob))
        }
        if (user.avatar)
            getAvatar();
    }, [user.avatar])

    if (params)
        return <Navigate to='/params' replace setUser={setUser} />
    else {
        return (
            <div>
                <button onClick={() => setParams(true)}> Params </button>
                <h1>
                    Welcome {user.username} !
                </h1>
                <p>
                    Your winratio is {user.winratio}
                    (W: {user.n_win}, L: {user.n_lose})
                </p>
                <img src={url} />
            </div>
        )
    }
}

export default ProfilePage;