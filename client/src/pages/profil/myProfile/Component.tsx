import React, { useContext } from "react";
import User from "../../../hooks/User";
import TwoFa from "./twoFa/2fa";
import "../../../styles/global.css";
import "../../../styles/profil.css";
import ProfileNavbar from "../Navbar";
import UserInfos from "./userInfos/Component";

//TODO : mettre à jour userauth

export default function MyProfile() {
  const { user } = useContext(User);
  return (
    <>
      <ProfileNavbar userId={user.id} />
      <div className="profil pt-3 flex flex-col items-center relative">
        <UserInfos />
        <TwoFa />
      </div>
    </>
  );
}
