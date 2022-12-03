import '../styles/userEntries.css'
import { StatusStyle } from '../styles/menus'

const UserEntry = ({ user, status }) => {
    const colors = {
        offline: 'grey',
        online: 'green',
        ingame: 'yellow',
        away: 'red',
    }

    return (
        <div className='userEntry' >
            <div className='username'>
                {user.username}
            </div>
            <div className='status'>
                <StatusStyle color={colors[status]}> `` </StatusStyle>
            </div>
        </div>
    )
}

export default UserEntry;