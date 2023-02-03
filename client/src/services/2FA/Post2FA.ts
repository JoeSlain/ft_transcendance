import axios from "axios";

export const send2faCode = (code: string) => {
  axios
    .post(
      "http://10.11.7.11:3001/api/auth/2fa/authenticate",
      {
        twoFactorAuthenticationCode: code,
      },
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data);
};
