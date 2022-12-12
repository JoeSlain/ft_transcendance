import axios from "axios";
import React, { useContext, useState } from "react";
import ReactCodeInput from "react-code-input";
import User from "../../hooks/User";
import "../../styles/global.css";
import "../../styles/profil.css";
import { userType } from "../../types/userType";

export default function MyProfile(): JSX.Element {
  const user = useContext(User);
  const [qrcode, setQrCode] = useState("");
  const [code, setCode] = useState();
  const [enabled, setEnabled] = useState(user.isTwoFactorAuthenticationEnabled);
  /*  function fileChangeHandler(event : React.ChangeEvent<HTMLInputElement> ): void{
    console.log(event!.target!.files![0]);
  } */
  const deactivate2fa = () => {
    axios
      .post(
        "http://localhost:3001/api/auth/2fa/turn-off",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => console.log(response));
    setEnabled(false);
    console.log("deactivete 2fa is: " + enabled);
  };

  // generate 2fa qr code
  async function generate2fa() {
    const res = await fetch("http://localhost:3001/api/auth/2fa/generate", {
      method: "POST",
      credentials: "include",
    });
    const blob = await res.blob();
    setQrCode(URL.createObjectURL(blob));
  }

  // get 2fa code
  const getCode = (code: any) => {
    console.log(code);
    setCode(code);
  };

  const turnOn2fa = (event: any) => {
    event.preventDefault();
    axios
      .post(
        "http://localhost:3001/api/auth/2fa/turn-on",
        {
          twoFactorAuthenticationCode: code,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => console.log(response));
    setEnabled(true);
  };
  const [inputValue, setInputValue] = useState<string>(user.username);
  function handleInputChange(e: React.FormEvent<HTMLInputElement>): void {
    setInputValue(e.currentTarget.value);
  }
  console.log(`User: ${user.username}, `);
  return (
    <>
      {user !== undefined && (
        <div className="profil flex flex-col items-center relative">
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
          <div className="2fa">
            {enabled ? (
              <button
                onClick={generate2fa}
                className="text-slate-200 border-2 border-slate-200"
              >
                {" "}
                activate 2fa{" "}
              </button>
            ) : (
              <button
                onClick={deactivate2fa}
                className="text-slate-200 border-2 border-slate-200"
              >
                {" "}
                deactivate 2fa{" "}
              </button>
            )}
            <p>
              <img src={qrcode} alt="qrcode" />
            </p>
            <form onSubmit={turnOn2fa}>
              <ReactCodeInput
                type="text"
                fields={6}
                onChange={getCode}
                name={""}
                inputMode={"url"}
              />
              <button type="submit"> confirm </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
