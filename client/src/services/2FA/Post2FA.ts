import axios from "axios";

export const send2faCode = (code: string) => {
  axios
    .post(
      "http://localhost:3001/api/auth/2fa/authenticate",
      {
        twoFactorAuthenticationCode: code,
      },
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data);
};
