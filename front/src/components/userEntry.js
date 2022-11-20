import '../styles/userEntries.css'
import { StatusStyle } from '../styles/menus'
import { isRouteErrorResponse } from 'react-router'

const UserEntry = ({ user }) => {
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
                <StatusStyle color={colors[user.status]}> `` </StatusStyle>
            </div>
        </div>
    )
}

export default UserEntry;