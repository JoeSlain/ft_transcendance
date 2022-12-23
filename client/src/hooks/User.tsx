import React from "react";
import { userType } from "../types/userType";

export default React.createContext<userType>({
  id: 0,
  username: "",
  email: "",
  twoFactorAuthenticationSecret: "",
  isTwoFactorAuthenticationEnabled: false,
  id42: 0,
  winratio: "",
  profile_pic: "",
  elo: 0,
  n_win: 0,
  n_lose: 0,
  avatar : null,
  date_of_sign: new Date()
});
