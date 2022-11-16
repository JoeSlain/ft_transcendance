import axios from "axios"
import { useParams } from 'react-router-dom'
import { useEffect, useState } from "react"
import { Navigate } from 'react-router-dom'

const ProfilePage = ({ user, setUser }) => {
    const [url, setUrl] = useState('')
    const params = useParams();

    const handleParamClick = () => {
        setUrl(`/profile/${params.id}/params`)
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

    return (
        <div>
            { url && <Navigate to={url} replace={true}/>
}
            <button onClick={handleParamClick} > Params </button>
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