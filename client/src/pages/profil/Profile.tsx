import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userType } from "../../types/userType";
import MyProfile from "./MyProfile";


export default function Profile(user : userType)
{
    const { id } = useParams();
    const [userProfile, setUserProfile] = useState<userType>({
        id: 0,
        username: "",
        email: "",
        twoFactorAuthenticationSecret: "",
        isTwoFactorAuthenticationEnabled: false,
        id42: 0,
        winratio: "",
        profile_pic: "",
        elo: 0,
        n_win: 0,
        n_lose: 0,
        date_of_sign: new Date()
    });
    useEffect(() => {
        axios(`http://localhost:3001/api/users/userid/:id`, {withCredentials: true})
        .then((res) =>
        {
            console.log("User found: " + res.data.profile_pic);
            setUserProfile(res.data);
        })
        .catch((e) => {console.log("User not found " + e);});
        }, []);
        console.log("UER ID");
    if (id === user.id.toString())
    {
        console.log("condition true");
        return (<MyProfile {...user}/>);
    }

    return (
        <>
            <h1>USER ID {userProfile.id}</h1>
        </>
    );
}