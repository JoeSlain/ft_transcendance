import { userType } from "../../types/userType";
import MyProfile from "./MyProfile";


export default function Profil(user : userType, id : number)
{
    if (id === user.id)
        return (<MyProfile/>);
    return (
        <>
            
        </>
    );
}