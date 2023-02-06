import React, { useContext, useState } from "react";
import User from "../../../../hooks/User";
import {
  turnOn2FA,
  useGenerate2FA,
} from "../../../../services/2FA/Generate2FA";
import Error from "../../../../components/error";
import { saveItem } from "../../../../utils/storage";
import { deactivate2fa } from "../../../../services/2FA/Desactivate2FA";

export default function TwoFa() {
  const { user, setUser } = useContext(User);
  const {
    data: qrCode,
    error: error2FA,
    refetch: refetchGenerate,
  } = useGenerate2FA();
  const [code, setCode] = useState("");

  async function localGenerate() {
    /* deactivate2fa().then(res => {
      if (!res) alert('error generating qrCode');
    }*/
  }

  async function localTurnOn2FA(e: React.SyntheticEvent) {
    e.preventDefault();
    turnOn2FA(code).then((res) => {
      console.log("res", res);
      if (!res) alert("invalid code");
      else {
        console.log("success");
        const newUser = { ...user, isTwoFactorAuthenticationEnabled: true };
        setUser(newUser);
        saveItem("user", newUser);
      }
      setCode("");
    });
  }

  async function localTurnOff2FA() {
    deactivate2fa().then((res) => {
      console.log("res", res);
      if (!res) alert("error deactivating 2fa");
      else {
        console.log("success");
        const newUser = { ...user, isTwoFactorAuthenticationEnabled: false };
        setUser(newUser);
        saveItem("user", newUser);
      }
      setCode("");
    });
  }

  if (user.isTwoFactorAuthenticationEnabled) {
    return (
      <div>
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case text-slate lg:gap-3 ml-2 mt-2  min-w-[10rem]"
          onClick={localTurnOff2FA}
        >
          Deactivate2fa
        </button>
      </div>
    );
  } else {
    return (
      <>
        
        <button
          className="btn btn-sm md:btn-md gap-2 normal-case text-slate lg:gap-3 ml-2 mt-2  min-w-[10rem] mt-6 mb-3"
          
          onClick={() => refetchGenerate()}
        >
          {" "}
          generate 2fa{" "}
        </button>
        {error2FA && <Error err="2FA code generation failed" />}
        {qrCode && <img src={qrCode} alt="qrcode"></img>}
        <form
          onSubmit={(e) => {
            localTurnOn2FA(e);
          }}
        >
          <div className=" flex flex-col items-center">
            <input
              placeholder="Enter 2fa code"
              type="password"
              value={code}
              minLength={6}
              maxLength={6}
              onChange={(e) => setCode(e.target.value)}
              name={""}
              inputMode={"numeric"}
              className="mt-2"
            />
            <button
              className="btn btn-sm md:btn-md gap-2 normal-case text-slate lg:gap-3 ml-2 mt-2  min-w-[10rem]"

              type="submit"
            >
              {!user.isTwoFactorAuthenticationEnabled
                ? "Activate2fa"
                : "Deactivate2fa"}
            </button>
          </div>
        </form>
      </>
    );
  }
}
