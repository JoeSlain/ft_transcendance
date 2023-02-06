import axios from "axios";

export const turnOn2fa = (code: String) => {
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
    .then((response) => response.data);
};
