import { useEffect, useState } from 'react';
import '../../styles/global.css';
import "../../styles/profil.css";
import { userType } from '../../types/userType';

export default function MyProfile(user : userType): JSX.Element
{
 /*  function fileChangeHandler(event : React.ChangeEvent<HTMLInputElement> ): void{
    console.log(event!.target!.files![0]);
  } */
  const [inputValue, setInputValue] = useState<string>(user.username);
  function handleInputChange(e : React.FormEvent<HTMLInputElement>): void
  {
    setInputValue(e.currentTarget.value);
  }
  useEffect(() => {
  }, [user]);
  return (
    <>
      {user !== undefined &&
        <div className='profil flex flex-col items-center relative'>
          <p className='text-slate-200'>Username</p>
          <input type="text" className='text-black ' value={inputValue} onChange={handleInputChange} ></input >        
          <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg shadow-lg tracking-wide uppercase  hover:text-white">
            <img src={user.profile_pic} alt="Avatar" className='w-32 sm:w-64 avatar cursor-pointer rounded-full'/>
            <p className='avatar-txt text-xs md:text-md cursor-pointer'>Change profile picture.</p>
            <input type='file' className="hidden" />
          </label>
        </div>
    }
    </>

  );
}


