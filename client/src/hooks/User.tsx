import React from "react";


export default React.createContext({
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
    date_of_sign: new Date()
});

