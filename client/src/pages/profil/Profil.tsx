import '../../styles/global.css';
//import type { userType } from '../../types/userType';
import ImageUploading, { ImageListType } from "react-images-uploading";
import { useState } from 'react';
import profile from "../../assets/user.png";
import "../../styles/global.css";
import "../../styles/profil.css";
import axios from 'axios';



type profilProps = {
    id: string
}



export default function Profil(props: profilProps)
{
  let avatar = axios.get('localhost:3001/')
  function fileChangeHandler(event : React.ChangeEvent<HTMLInputElement> ){
    console.log(event!.target!.files![0]);

  }
  return (
    <div className='profil'>
      <input className='input' type="file" onChange={fileChangeHandler}/>

    </div>
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


