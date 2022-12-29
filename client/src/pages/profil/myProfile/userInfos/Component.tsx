import { useContext, useState } from "react";
import User from "../../../../hooks/User";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getSavedItem, saveItem } from "../../../../utils/storage";

//Username and avatar component
export default function UserInfos() {
  const { user } = useContext(User); //user data to print
  const { register, handleSubmit } = useForm();
  const [avatar, setAvatar] = useState({
    //State to update avatar when user uploads img
    url: user.avatar != null ? user.avatar : user.profile_pic,
    file: "",
  });

  async function onSave(formValue: any) { //sends form to back
    console.log("🚀 formValue", formValue);
    user.username = formValue.username;
    await axios
      .post("http://localhost/api/users/uploadAvatar", {
        user,
        fileName: avatar,
      })
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
  function handleAvatar(data: any) { //Handles avatar upload
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
