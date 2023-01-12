import { useContext, useEffect, useState } from "react";
import User from "../../../../hooks/User";
import { useForm } from "react-hook-form";
import axios from "axios";
import { getSavedItem, saveItem } from "../../../../utils/storage";
import { BACK_ROUTE } from "../../../../services/back_route";

type avatarState = {
  url: string;
  file: any;
};

async function getAvatar(userId: number) {
  const res = await fetch(`${BACK_ROUTE}users/getAvatar/${userId}`, {
    method: "GET",
    credentials: "include",
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

//Username and avatar component
export default function UserInfos() {
  let { user } = useContext(User); //user data to print
  const { register, handleSubmit } = useForm();
  const [avatar, setAvatar] = useState<avatarState>({
    //State to update avatar when user uploads img
    url: user.avatar != null ? user.avatar : user.profile_pic,
    file: null,
  });
  useEffect(() => {
    if (user.avatar != null) {
      console.log("effect");
      getAvatar(user.id).then((res) => {
        setAvatar({ url: res, file: null });
      });
      console.log("avatar modified?: ", avatar.url);
    }
  }, []);
  async function onSave(formValue: any) {
    //sends form to back

    if (avatar.file != null) {
      let formData = new FormData();
      const ext = avatar.file.name.split(".").pop();
      if (ext !== "jpg" && ext !== "jpeg" && ext !== "png")
        console.log("error: image extension not supported");
      else {
        formData.append("file", avatar.file, `${user.username}.avatar.jpg`);
      }
      console.log("🚀 ~ file: Component.tsx:35 ~ onSave ~ formData", formData);
      await axios
        .post(`${BACK_ROUTE}users/uploadAvatar`, formData, {
          withCredentials: true,
        })
        .then((res: any) => {
          console.log("then res ", res);
        })
        .catch((e) => {
          console.log("failed uploading avatar: ", e.message);
        });
      user.avatar = await getAvatar(user.id);
      setAvatar({ ...avatar, url: user.avatar });
    }
    saveItem("user", user);
    if (formValue.username !== user.username) {
      user.username = formValue.username;
      await axios
        .post(
          `${BACK_ROUTE}users/updateUser`,
          { user },
          {
            withCredentials: true,
          }
        )
        .then((data) => {
          console.log("Username changed: ", data);
        })
        .catch((err) => {
          console.log("🚀 ~ file: Component.tsx:35 ~ onSave ~ err", err);
        });
    }
    await getSavedItem("user");
  }
  function handleAvatar(data: any) {
    //Handles avatar upload
    // console.log("🚀 ~ file: Component.tsx:58 ~ handleAvatar ~ data", data);

    setAvatar({
      url: URL.createObjectURL(data.target.files[0]),
      file: data.target.files[0],
    });
  }
  return (
    <>
      <form onSubmit={handleSubmit(onSave)}>
        <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg  tracking-wide uppercase  hover:text-white">
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
        <div className="flex flex-col items-center justify-center">
          <div>
            <p className="text-slate-200">Username</p>
            <input defaultValue={user.username} {...register("username")} />
          </div>
          <button
            className="btn mt-2 normal-case  text-slate-200 center"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </>
  );
}
