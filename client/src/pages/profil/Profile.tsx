import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { userType } from "../../types/userType";
import PageNotFound from "../404/404";
import MyProfile from "./MyProfile";
import "../../styles/global.css";
import User from "../../hooks/User";
import { getUser } from "../../services/GetUser";
import { useQuery } from "@tanstack/react-query";

export default function Profile() {
  const user = useContext(User);
  const userId = useParams().id || "";

  
  const { isLoading, error, data, isFetching } = useQuery({
    queryKey: ["userData", userId],
    queryFn: ({ queryKey }) => getUser(queryKey[1]),
  });
  if (userId === user.id.toString())
  {
    return <MyProfile/>
  }
  if (error)
    return (
      <h1 className="heightMinusNavProfile flex justify-center text-slate-200 text-8xl items-center">
        Profile not found.
      </h1>
    );
  if (isLoading) {
    return <h1>Loading</h1>;
  }
  return <>
      {data &&
        <div className='profil flex flex-col items-center relative'>
          <p className='text-slate-200'>Username</p>
          <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg shadow-lg tracking-wide uppercase  hover:text-white">
            <img src={data.profile_pic} alt="Avatar" className='w-32 sm:w-64 avatar cursor-pointer rounded-full'/>
          </label>

        </div>
    }
    </>
  
}
