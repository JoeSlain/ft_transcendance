import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { useFormAction } from "react-router-dom";
import User from "../../../../hooks/User";
import { useForm } from "react-hook-form";
import axios from "axios";

//TODO: onSubmit
export default function UserInfos() {
  const { user, setUser } = useContext(User); //use data to print
  const [inputValue, setInputValue] = useState<string>(user.username); //username input
  /* const [qrcode, setQrCode] = useState(""); //2fa qr code to print
  const [code, setCode] = useState(); // ?
  const [enabled, setEnabled] = useState(user.isTwoFactorAuthenticationEnabled); // Is QrCode enabled ?


     const { isLoading, error, data } = useQuery({
      queryKey: ["userData", userId],
      queryFn: ({ queryKey }) => updateUser(queryKey[1]),
    }); */
  //Username field changing
  function handleInputChange(e: React.FormEvent<HTMLInputElement>): void {
    setInputValue(e.currentTarget.value);
  }

  const { register, control, handleSubmit } = useForm();
  async function onSave(formValue: any) {
    console.log("🚀 ~ file: Component.tsx:28 ~ onSave ~ formValue", formValue)
    setUser({...user, username : formValue.username});
    console.log("🚀 ~ file: Component.tsx:30 ~ onSave ~ user", user)
    
    await axios
      .post("http://localhost:3001/api/users/updateUser", {user}, {
        withCredentials: true,
      })
      .then((res) => {
        console.log("🚀 ~ file: Component.tsx:30 ~ onSave ~ res", res);
      })
      .catch((err) => {
        console.log("🚀 ~ file: Component.tsx:35 ~ onSave ~ err", err);
      });
    console.log(
      "🚀 ~ file: Component.tsx:54 ~ UserInfos ~ formValue",
      formValue
    );
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
            src={user.avatar != null ? user.avatar : user.profile_pic}
            alt="Avatar"
            className="w-32 sm:w-64 avatar cursor-pointer rounded-full"
          />
          <p className="avatar-txt text-xs md:text-md cursor-pointer">
            Change profile picture.
          </p>
          <input {...register("avatar")} type="file" className="hidden" />
        </label>
      </form>
    </>
  );
}
