import '../../styles/global.css';
import axios from 'axios';
import avatarGenerator from '../../utils/avatar';
import type { userType } from '../../types/userType';

type profilProps = {
    id: number
}

export default function Profil(props: profilProps)
{
    let user : userType;
    axios.get(`http://localhost:3000/api/user:${props.id}`, { withCredentials: true })
    .then(function (response) {
        {user.id} = response.data;
    })
    .catch(function (error){
        console.log(`Error: no user with id: ${props.id}`);
    });
    const avatar = user.avatar ? user.avatar : avatarGenerator();
    return (
        <>

        </>
    );
}


