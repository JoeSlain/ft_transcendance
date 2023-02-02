import React from "react";
import { userType } from "../types/userType";

type IUserContext = {
  user: userType;
  setUser: (arg: userType) => void;
};

export default React.createContext<IUserContext>({
  user: {
    id: 0,
    username: "",
    email: "",
    //twoFactorAuthenticationSecret: "",
    isTwoFactorAuthenticationEnabled: false,
    id42: 0,
    winratio: "",
    profile_pic: "",
    elo: 0,
    n_win: 0,
    n_lose: 0,
    avatar: null,
    date_of_sign: new Date(),
    blocked: [],
    games: [],
  },
  setUser: () => {},
});
