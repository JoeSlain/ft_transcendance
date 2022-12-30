import { useContext, useState } from "react";
import User from "../../../../hooks/User";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getSavedItem, saveItem } from "../../../../utils/storage";

type avatarState = {
  url : string,
  file : any
}

//Username and avatar component
export default function UserInfos() {
  const { user } = useContext(User); //user data to print
  const { register, handleSubmit } = useForm();
  const [avatar, setAvatar] = useState<avatarState>({
    //State to update avatar when user uploads img
    url: user.avatar != null ? user.avatar : user.profile_pic,
    file: null,
  });

  async function onSave(formValue: any) {
    //sends form to back
    console.log("🚀 formValue", formValue);
    console.log("🚀 ~ file: Component.tsx:16 ~ UserInfos ~ avatar", avatar);

    user.username = formValue.username;
    let formData = new FormData();
    const ext = avatar.file.name.split(".").pop();
    if (ext !== "jpg" && ext !== "jpeg" && ext !== "png")
      console.log("error: image extension not supported");
      else {
          formData.append('file', avatar.file, `${user.username}.avatar.jpg`); 
      }
     //  console.log("🚀 ~ file: Component.tsx:35 ~ onSave ~ formData", formData)
      
    await axios
      .post(
        "http://localhost:3001/api/users/uploadAvatar",
        {
          formData
        },
        { withCredentials: true }
      )
      .then(() => {
        console.log("avatar pusher");
      })
      .catch((e) => {
        console.log("failed uplaoding avatar: ", e.message);
      });
    console.log("avatar is: ", avatar);
    saveItem("user", user);
    await getSavedItem("user");
    await axios
      .post(
        "http://localhost:3001/api/users/updateUser",
        { user },
        {
          withCredentials: true,
        }
      )
      .then((data) => {
        console.log("avatar res", data);
      })
      .catch((err) => {
        console.log("🚀 ~ file: Component.tsx:35 ~ onSave ~ err", err);
      });
    console.log(
      "🚀 ~ file: Component.tsx:54 ~ UserInfos ~ formValue",
      formValue
    );
  }
  function handleAvatar(data: any) {
    //Handles avatar upload
    console.log("🚀 ~ file: Component.tsx:58 ~ handleAvatar ~ data", data);

    setAvatar({
      url: URL.createObjectURL(data.target.files[0]),
      file: data.target.files[0],
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSave)}>
        <div>
          <p className="text-slate-200">Username</p>
          <input defaultValue={user.username} {...register("username")} />
        </div>

        <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg shadow-lg tracking-wide uppercase  hover:text-white">
          <img
            src={avatar.url}
            alt="Avatar"
            className="w-32 sm:w-64 avatar cursor-pointer rounded-full"
          />
          <p className="avatar-txt text-xs md:text-md cursor-pointer">
            Change profile picture.
          </p>
          <input onChange={handleAvatar} type="file" className="hidden" />
        </label>
        <button className="text-slate-200 center" type="submit">
          Submit
        </button>
      </form>
    </>
  );
}
