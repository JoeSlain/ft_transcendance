import '../../styles/global.css';
import { useEffect, useState } from 'react';
import "../../styles/global.css";
import "../../styles/profil.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { userType } from '../../types/userType';

export default function MyProfile(user : userType): JSX.Element
{
  const { id } = useParams();
 /*  function fileChangeHandler(event : React.ChangeEvent<HTMLInputElement> ): void{
    console.log(event!.target!.files![0]);
  } */

  return (
    <>
      {user !== undefined &&
        <div className='profil flex flex-col items-center relative'>
             <input type="text" className='text-black ' placeholder={user.username} ></input >
 
        
          <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg shadow-lg tracking-wide uppercase hover:text-white">
            <img src={user.profile_pic} alt="Avatar" className='w-32 sm:w-64 avatar rounded-full'/>
            <p className='avatar-txt text-xs md:text-md'>Change profile picture.</p>
            <input type='file' className="hidden" />
          </label>
        </div>
    }
    </>
  
  );
}


