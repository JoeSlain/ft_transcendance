import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userType } from "../../types/userType";
import PageNotFound from "../404/404";
import MyProfile from "./MyProfile";
import "../../styles/global.css"


export default function Profile(user : userType)
{
    const { id } = useParams();
    console.log('id is ' + id);
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
        axios(`http://localhost:3001/api/users/userid/${id}`, {withCredentials: true})
        .then((res) =>
        {
            console.log("Userid found: " + res.data.profile_pic);
            setUserProfile(res.data);
        })
        .catch((e) => {console.log("User not found " + e);
                setUserProfile({...userProfile, id : -1});
        });
        }, []);
    if (id === user.id.toString())
    {
        console.log("condition true");
        return (<MyProfile {...user}/>);
    }
    else if (userProfile.id === -1)
        return ( <h1 className="heightMinusNavProfile flex justify-center text-slate-200 text-8xl items-center">Profile not found.</h1>);
    else if (userProfile.id === 0)
    {
        return(
            <h1>Loading</h1>
        );
    }
    else
    return (
        <>
            <h1 className="">USER ID {userProfile.id}</h1>
        </>
    );
}