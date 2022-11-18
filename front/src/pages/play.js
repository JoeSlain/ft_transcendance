import '../styles/play.css'
import '../styles/popup.css'
import { useState } from 'react'
import Friend from './friend'

const Play = () => {
    const user = JSON.parse(localStorage.getItem('user'))

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