import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import ReactCodeInput from "react-code-input";
import User from "../../../../hooks/User";

//TODO: onSubmit
export default function UserInfos() {
  const user = useContext(User); //use data to print
  const [inputValue, setInputValue] = useState<string>(user.username); //username input
  const [qrcode, setQrCode] = useState(""); //2fa qr code to print
  const [code, setCode] = useState(); // ?
  const [enabled, setEnabled] = useState(user.isTwoFactorAuthenticationEnabled); // Is QrCode enabled ?

  /*     const { isLoading, error, data } = useQuery({
      queryKey: ["userData", userId],
      queryFn: ({ queryKey }) => updateUser(queryKey[1]),
    }); */
  //Username field changing
  function handleInputChange(e: React.FormEvent<HTMLInputElement>): void {
    setInputValue(e.currentTarget.value);
  }
  return (
    <>
      <p className="text-slate-200">Username</p>
      <input
        type="text"
        className="text-black "
        value={inputValue}
        onChange={handleInputChange}
      ></input>
      <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg shadow-lg tracking-wide uppercase  hover:text-white">
        <img
          src={user.profile_pic}
          alt="Avatar"
          className="w-32 sm:w-64 avatar cursor-pointer rounded-full"
        />
        <p className="avatar-txt text-xs md:text-md cursor-pointer">
          Change profile picture.
        </p>
        <input type="file" className="hidden" />
      </label>
    </>
  );
}
