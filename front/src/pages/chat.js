import { useState } from "react"
import '../styles/chat.css'


const Chat = () => {
    const [message, setMessage] = useState(null)

    const submitMessage = (e) => {
        e.preventDefault()
    }

    return (
        <div className='chat'>
            <div className='aside'>
                <h2> CHANNELS </h2>
            </div>
            <div className='tabs'>
            </div>
            <div className='main-content'>
                <div className='messages'>
                    <h2> CHAT </h2>
                </div>
                <div className='message'>
                <form onSubmit={submitMessage} >
                    <input
                        value={message}
                        onChange={(e) => {setMessage(e.target.value)}}
                    />
                    <button type='submit'>SEND</button>
                </form>
                </div>
            </div>
        </div>
    )
}

export default Chat;