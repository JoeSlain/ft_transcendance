import { useParams } from "react-router-dom";
import MyProfile from "./myProfile/Component";
import "../../styles/global.css";
import { useQuery } from "@tanstack/react-query";
import ProfileNavbar from "./Navbar";
import Loading from "../../components/loading";
import Error from "../../components/error";
import getAvatar from "../../services/User/useGetAvatar";
import useCurrentUserQuery from "../../services/User/useCurrentUserQuery";
import useUserQuery from "../../services/User/useUserIdQuery";

export default function Profile() {
  const userId = useParams().id || "";
  console.log("profile user id", userId);
  const { isLoading: avatarLoading, error: avatarErr, data: avatar } = useQuery(
    {
      queryKey: ["avatar", userId],
      queryFn: ({ queryKey }) => getAvatar(parseInt(queryKey[1])),
    }
  );
  const {
    isLoading: isCurrentLoading,
    data: user,
    isSuccess: isCurrentUserSucces,
  } = useCurrentUserQuery();
  const {
    isLoading,
    error,
    data,
    isSuccess: isFetchedUserSucces,
  } = useUserQuery(userId);
  if (error) return <Error err="Profil not found" />;
  if (isLoading || isCurrentLoading) {
    return <Loading />;
  }
  if (isFetchedUserSucces && isCurrentUserSucces) {
    if (userId === user.id.toString()) {
      return <MyProfile />;
    }
    return (
      <>
        <ProfileNavbar userId={parseInt(userId)} />
        <div className="profil flex flex-col items-center relative">
          <p className="text-slate-200">Username:</p>
          <p className="text-slate-200">{data.username}</p>
          <label className="w-64 flex justify-center items-center px-4 py-6 rounded-lg  tracking-wide uppercase  hover:text-white">
            <img
              src={avatar != null ? avatar : data.profile_pic}
              alt="Avatar"
              className="w-32 sm:w-64 rounded-full"
            />
          </label>
        </div>
      </>
    );
  }
  return <></>;
}
