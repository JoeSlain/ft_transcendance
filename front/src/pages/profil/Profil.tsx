import '../../styles/global.css';
import axios from 'axios';

type profilProps = {
    id: number
}


export default function Profil(props: profilProps)
{
    const user = axios.get(`http://localhost:3000/api/user:${props.id}`)
    .catch(function (error){
        console.log(`Error: no user with id: ${props.id}`);
    });
    return (
        <>

        </>
    );
}


