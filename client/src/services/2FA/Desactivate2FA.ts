import axios from "axios";

export const deactivate2fa = () => {
  return axios
    .post(
      "http://10.11.7.11:3001/api/auth/2fa/turn-off",
      {},
      {
        withCredentials: true,
      }
    )
    .then((response) => response.data);
};
