import { useContext, useState } from "react"
import { Navigate, useNavigate } from 'react-router-dom'
import { UserContext } from "../context/userContext"

const ProfilePage = ({ setUser }) => {
    const navigate = useNavigate();
    const user = useContext(UserContext);

    return (
        <div>
            <button onClick={() => navigate('/params', true, setUser)}> Params </button>
            <h1>
                Welcome {user.username} !
            </h1>
            <p>
                Your winratio is {user.winratio}
                (W: {user.n_win}, L: {user.n_lose})
            </p>
            <img src={user.profile_pic} />
        </div>
    )
}

export default ProfilePage;