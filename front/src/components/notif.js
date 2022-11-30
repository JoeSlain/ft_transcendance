import { useContext } from 'react';
import Popup from 'reactjs-popup';
import '../styles/notif.css';
import { ChatContext } from '../context/socketContext';
import { Modal } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const Notif = ({ notifs, setNotifs }) => {
    const socket = useContext(ChatContext);
    const notif = notifs[0];

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
        setNotifs(notifs.filter(n => n.id !== notif.id))
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
        setNotifs(notifs.filter(n => n.id !== notif.id))
    }

    return (
        <Modal show={true}>
            <div className='notif'>
                <div className='header'>
                    <Modal.Title id='contained-modal-title-vcenter'>
                        {notif.header}
                    </Modal.Title>
                </div>
                <div className='body'>
                    {notif.body}
                </div>
                <div className='buttons'>
                    <Button variant='primary' onClick={handleAccept} > {notif.accept} </Button>
                    <Button variant='secondary' onClick={handleDecline} > {notif.decline} </Button>
                </div>
            </div>
        </Modal>
    )
}

export default Notif;