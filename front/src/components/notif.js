import { useContext } from 'react';
import Popup from 'reactjs-popup';
import '../styles/notif.css';
import { SocketContext } from '../context/socketContext';
import { Alert } from 'react-bootstrap/Alert';

const Notif = ({notif}) => {
    const socket = useContext(SocketContext);

    const handleAccept = () => {
        console.log(notif.acceptEvent)
        //socket.emit(notif.acceptEvent)
    }

    const handleDecline = () => {
        console.log(notif.declineEvent)
    }

    console.log('notif', notif)

    return (
        <>
        </>
    )
}

export default Notif;