import { useContext } from 'react';
import Popup from 'reactjs-popup';
import '../styles/notif.css';
import { SocketContext } from '../context/socketContext';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const Notif = ({ notif, setNotif }) => {
    const socket = useContext(SocketContext);

    const handleAccept = () => {
        console.log(notif.acceptEvent)
        setNotif(null)
        //socket.emit(notif.acceptEvent)
    }

    const handleDecline = () => {
        console.log(notif.declineEvent)
        setNotif(null)
    }

    return (
        <Modal show={true}>
            <div className='notif'>
                <div className='header'>
                    <Modal.Title id='contained-modal-title-vcenter'> {notif.content.header} </Modal.Title>
                </div>
                <div className='body'>
                    {notif.content.body}
                </div>
                <div className='buttons'>
                    <Button variant='primary' onClick={handleAccept} > Accept </Button>
                    <Button variant='secondary' onClick={handleDecline} > Decline </Button>
                </div>
            </div>
        </Modal>
    )
}

export default Notif;