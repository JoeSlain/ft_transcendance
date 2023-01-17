import { useContext } from "react";
import { useParams } from "react-router-dom";
import MyProfile from "./myProfile/Component";
import "../../styles/global.css";
import User from "../../hooks/User";
import { getUser } from "../../services/User/GetUser";
import { useQuery } from "@tanstack/react-query";
import ProfileNavbar from "./Navbar";
import Loading from "../../components/loading";

export default function Profile() {
  const { user } = useContext(User);
  const userId = useParams().id || "";
  console.log("In profile by id");
  let { isLoading, error, data } = useQuery({
    queryKey: ["userData", userId],
    queryFn: ({ queryKey }) => getUser(queryKey[1]),
  });
  if (userId === user.id.toString()) {
    return <MyProfile />;
  }
  if (error)
    return (
      <h1 className="heightMinusNavProfile flex justify-center text-slate-200 text-8xl items-center">
        Profile not found.
      </h1>
    );
  isLoading = true;
  if (isLoading) {
    return (
      <Loading/>
    );
  }
  return (
    <>
      <ProfileNavbar userId={parseInt(userId)} />

      {data && (
        <div className="profil flex flex-col items-center relative">
          <p className="text-slate-200">Username:</p>
          <p className="text-slate-200">{data.username}</p>
          <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg  tracking-wide uppercase  hover:text-white">
            <img
              src={data.profile_pic}
              alt="Avatar"
              className="w-32 sm:w-64 rounded-full"
            />
          </label>
        </div>
      )}
    </>
  );
}
