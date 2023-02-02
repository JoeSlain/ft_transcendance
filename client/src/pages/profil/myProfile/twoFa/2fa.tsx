import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import ReactCodeInput from "react-code-input";
import User from "../../../../hooks/User";
import {
  generate2fa,
  turnOn2FA,
  useGenerate2FA,
} from "../../../../services/2FA/Generate2FA";
import Error from "../../../../components/error";

export default function TwoFa() {
  const { user, setUser } = useContext(User);
  const {
    data: qrCode,
    error: error2FA,
    refetch: refetchGenerate,
  } = useGenerate2FA();
  async function localTurnOn2FA() {
    turnOn2FA()
      .then((res) => (user.isTwoFactorAuthenticationEnabled = true))
      .catch((err) => console.log("Error enablie 2fa: ", err));
  }

  console.log('user', user)
  console.log('qrCode', qrCode)

  if (!user.isTwoFactorAuthenticationEnabled) {
    return (
      <>
        <button className="bg-white" onClick={() => refetchGenerate()}>
          {" "}
          generate 2fa{" "}
        </button>
        {error2FA && <Error err="2FA code generation failed" />}
        {qrCode && <img src={qrCode} alt="qrcode"></img> }
      </>
    );
  }
  //} else if (!user.isTwoFactorAuthenticationEnabled) {
    return (
      <>
        <button className="bg-white" onClick={() => localTurnOn2FA()}>
          {" "}
          enable 2fa{" "}
        </button>
      </>
    );
  //}
  return (
    <>
      {/* <div>
        <p> Enter code from GoogleAuthenticator app </p>
         <form onSubmit={send2faCode}>
            <ReactCodeInput
              type="text"
              fields={6}
              onChange={getCode}
              name={""}
              inputMode={"email"}
            />
            <button type="submit"> confirm </button>
          </form> *
      </div> */}
    </>
  );
}
