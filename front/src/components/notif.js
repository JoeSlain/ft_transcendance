import { useContext } from 'react';
import Popup from 'reactjs-popup';
import '../styles/notif.css';
import { SocketContext } from '../context/socketContext';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const Notif = ({ notif, setNotif }) => {
    const socket = useContext(SocketContext);

    const handleAccept = () => {
        if (notif.acceptEvent !== undefined) {
            console.log(notif.acceptEvent)
            socket.emit(notif.acceptEvent, {
                from: notif.from,
                to: notif.to,
            })
        }
        else
            console.log('accept event undefined')
        setNotif(null)
    }

    const handleDecline = () => {
        if (notif.declineEvent !== undefined) {
            console.log(notif.declineEvent)
            socket.emit(notif.declineEvent, {
                from: notif.from,
                to: notif.to,
            })
        }
        else
            console.log('decline event undefined')
        setNotif(null)
    }

    return (
        <Modal show={true}>
            <div className='notif'>
                <div className='header'>
                    <Modal.Title id='contained-modal-title-vcenter'>
                        {notif.msg.header}
                    </Modal.Title>
                </div>
                <div className='body'>
                    {notif.msg.body}
                </div>
                <div className='buttons'>
                    <Button variant='primary' onClick={handleAccept} > {notif.msg.accept} </Button>
                    <Button variant='secondary' onClick={handleDecline} > {notif.msg.decline} </Button>
                </div>
            </div>
        </Modal>
    )
}

export default Notif;