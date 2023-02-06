import axios from "axios";
import React, { useState } from "react";
import ReactCodeInput from "react-code-input";
import { Navigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Params = () => {
  const [qrcode, setQrCode] = useState("");
  const [code, setCode] = useState("");
  const [url, setUrl] = useState("");
  const params = useParams();

  // profile
  const profile = () => {
    setUrl(`/profile/${params.id}`);
  };

  // deactivate 2fa
  const deactivate2fa = () => {
    axios
      .post(
        "http://10.11.7.11:3001/api/auth/2fa/turn-off",
        {},
        {
          withCredentials: true,
        }
      )
      .then((response) => console.log(response));
  };

  // generate 2fa qr code
  async function generate2fa() {
    const res = await fetch("http://10.11.7.11:3001/api/auth/2fa/generate", {
      method: "POST",
      credentials: "include",
    });
    const blob = await res.blob();
    setQrCode(URL.createObjectURL(blob));
  }

  // get 2fa code
  const getCode = (code: string) => {
    console.log(code);
    setCode(code);
  };

  const turnOn2fa = (event: React.FormEvent) => {
    event.preventDefault();
    axios
      .post(
        "http://10.11.7.11:3001/api/auth/2fa/turn-on",
        {
          twoFactorAuthenticationCode: code,
        },
        {
          withCredentials: true,
        }
      )
      .then((response) => console.log(response));
  };

  return (
    <div>
      {url && <Navigate to={url} />}

      <button onClick={generate2fa}> activate 2fa </button>
      <button onClick={deactivate2fa}> deactivate 2fa </button>
      <button onClick={profile}> profile </button>
      <p>
        <img src={qrcode} />
      </p>
      <form onSubmit={turnOn2fa}>
        <ReactCodeInput
          type="text"
          fields={6}
          onChange={getCode}
          name={""}
          inputMode={"email"}
        />
        <button type="submit"> confirm </button>
      </form>
    </div>
  );
};

export default Params;
