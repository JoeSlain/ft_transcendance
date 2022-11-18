import '../../styles/global.css';
//import type { userType } from '../../types/userType';
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useEffect, useState } from 'react';
import profile from "../../assets/user.png";
import "../../styles/global.css";
import "../../styles/profil.css";
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { userType } from '../../types/userType';

async function getUser(id: string | undefined, user : any)
{
  await axios.get(`http://localhost:3001/api/users/${id}`, user)
  .then((res) => {console.log("User found");})
  .catch((e) => {console.log("User not found " + e);});
  return user;
}

export default function Profil()
{
  const { id } = useParams();
  const [user, setUser] = useState<any>(undefined);
  function fileChangeHandler(event : React.ChangeEvent<HTMLInputElement> ): void{
    console.log(event!.target!.files![0]);
  }
  useEffect(() => {
    axios(`http://localhost:3001/api/users/${id}`, {withCredentials: true})
    .then((res) =>
    {
      console.log("User found: " + res.data.profile_pic);
      setUser(res.data);
    })
    .catch((e) => {console.log("User not found " + e);});
  }, [])
   return (
    <>
      { user !== undefined && 
      <div className='profil flex flex-col items-center relative'>
        <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg shadow-lg tracking-wide uppercase cursor-pointer  hover:text-white">
          <img src={user.profile_pic} alt="Avatar" className='w-32 sm:w-64 avatar rounded-full'/>
          <p className='avatar-txt text-xs md:text-md'>Change profile picture.</p> 
        <input type='file' className="hidden" />
    </label>


        </div>
      }
    </>
    
  );
   /*  console.log("PROFIL");
    const [images, setImages] = useState([]);
    const [index, setIndex] = useState(0);
    const maxNumber = 69;
    const onChange = (
        imageList: ImageListType,
        addUpdateIndex: number[] | undefined
    ) => {
        console.log(imageList, addUpdateIndex);
        setImages(imageList as never[]);
        setIndex(index + 1);
    };

  return (
      <div className='profil'>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        >
        {({
          imageList,
          onImageUpload,
          onImageUpdate,
          onImageRemove,
          isDragging,
          dragProps
        }) => (
          // write your building UI
          <div className="upload__image-wrapper">
            <img
                className='avatar'
                src={imageList[index].dataURL} alt='avatar'
                style={isDragging ? { opacity: 0.8 } : undefined}
                onClick={onImageUpload}
                {...dragProps}
            />
           

          </div>
        )}
      </ImageUploading>

        </div> 
    );*/
}


