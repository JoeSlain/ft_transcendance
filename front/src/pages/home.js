import axios from "axios"
import { useParams } from 'react-router-dom'
import { useEffect } from "react"

const HomePage = ({ user, setUser }) => {
    const params = useParams();

    console.log('params', params);
    console.log(user)

    useEffect(() => {
        axios
            .get(`http://localhost:3001/api/users/${params.id}`, {
                withCredentials: true
            })
            .then(response => setUser(response.data))
    }, [])

    return (        
        <div>
            <h1> Welcome {user.username} ! </h1>

            <p>
                Your winratio is {user.winratio} 
                (W: {user.n_win}, L: {user.n_lose})
            </p>
            <p> Your avatar url is {user.profile_pic} </p>
        </div>
    )
}

export default HomePage;