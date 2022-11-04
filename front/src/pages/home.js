import { useEffect } from "react"
import axios from "axios"

const HomePage = () => {
    const handleClick = (event) => {
        event.preventDefault();
        window.top.location = 'http://localhost:3001/api/auth/login'
    }

    return (
        <div className='HomePage' >
            <p> Welcome to 42Pong ! </p>
            <button onClick={handleClick} > 42 auth </button>
        </div>
    )
}

export default HomePage