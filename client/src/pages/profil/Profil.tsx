import axios from "axios";
import { useEffect, useState } from "react";
import { userType } from "../../types/userType";
import MyProfile from "./MyProfile";

type profileProps = {
    user : userType,
    id : number
}

export default function Profil( props : profileProps)
{
    const searchBarProps = { // make sure all required component's inputs/Props keys&types match
        user: props.user,
        id: props.id
      }
    if (id === user.id)
        return (<MyProfile user={user}/>);
    

    return (
        <>

        </>
    );
}