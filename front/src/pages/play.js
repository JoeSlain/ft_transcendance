import '../styles/play.css'
import '../styles/popup.css'

const Play = () => {
    const user = JSON.parse(localStorage.getItem('user'))

    const searchOpponent = () => {

    }

    const invite = () => {

    }

    return (
        <div className='play'>
            <div className='main'>
                <div className='main-content'>
                    <h1>PLAYERS</h1>
                    <p>
                        {user.username}
                    </p>
                </div>
                <div className='footer'>
                    <button onClick={searchOpponent}> Play </button>
                </div>
            </div>
            <div className='aside'>
                <h2> Friends </h2>
            </div>
        </div>
    )
}

export default Play;