import '../styles/play.css'
import { useContext, useState } from 'react'
import Friend from './friend'
import { UserContext } from '../context/userContext'

const Play = () => {
    const user = useContext(UserContext)

    const searchOpponent = () => {

    }

    const invite = () => {

    }

    return (
        <div className='play'>
            <h1>PLAYERS</h1>
            <p>
                {user.username}
            </p>

            <div className='footer'>
                <button onClick={searchOpponent}> Play </button>
            </div>
        </div >
    )
}

export default Play;