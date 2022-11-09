import axios from "axios"
import { useState, useEffect } from "react"

const HomePage = () => {
    useEffect(() => {
        axios
            .get('http://localhost:3001/api/auth/home', {
                withCredentials: true
            })
            .then(response => console.log(response))
    }, [])
    
    return (
        <div>
            Welcome user !
        </div>
    )
}

export default HomePage;