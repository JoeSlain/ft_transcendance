import { EntryStyles } from "../styles/menus"

const UserEntry = ({ user }) => {
    return (
        <EntryStyles >
            {user.username}
        </EntryStyles>
    )
}

export default UserEntry;