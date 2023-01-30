import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/User/GetUser";
import "../../styles/global.css";
import CSS from "csstype";
import History from "./History";
import ProfileNavbar from "../profil/Navbar";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import User from "../../hooks/User";

const win: CSS.Properties = {
  backgroundColor: "#4ade80",
};
const lose: CSS.Properties = {
  backgroundColor: "#f87171",
};

export default function Stats() {
  const { user } = useContext(User);
  const param = useParams().id;
  const userId = param ? parseInt(param) : user.id;

  //get user
  let { isLoading, data, error } = useQuery({
    queryKey: ["userData", userId],
    queryFn: ({ queryKey }) => getUser(queryKey[1].toString()),
  });
  /*   isLoading = true;
  error = true; */
  if (isLoading) {
    return (
      <div className="flex justify-center items-center heightMinusNavProfile ">
        <progress className="progress w-56"></progress>
      </div>
    );
  }
  if (error) {
    return (
      <div className="alert alert-error shadow-lg mt-2">
        <div>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="stroke-current flex-shrink-0 h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>Error! Couldn't find user.</span>
        </div>
      </div>
    );
  }
  if (data) {
    let win_percentage, loss_percentage;
    if (data.n_win || data.n_lose) {
      win_percentage = (data.n_win / (data.n_lose + data.n_win)) * 100;
      win_percentage = Math.ceil(win_percentage);
      loss_percentage = (data.n_lose / (data.n_lose + data.n_win)) * 100;
      loss_percentage = Math.ceil(loss_percentage);
    } else {
      win_percentage = 0;
      loss_percentage = 0;
    }
    return (
      <>
        <ProfileNavbar userId={userId} />

        <div className="flex flex-col justify-center gap-10 items-center pt-5 ">
          <div className="stats shadow mb-5 justify-center">
            <div className="stat " style={win}>
              <div className="stat-title">Wins</div>
              <div className="stat-value">{data.n_win}</div>
              <div className="stat-desc">{win_percentage}% wins</div>
            </div>
            <div className="stat ">
              <div className="stat-title">Elo</div>
              <div className="stat-value">{data.elo}</div>
            </div>
            <div className="stat " style={lose}>
              <div className="stat-title">Losses</div>
              <div className="stat-value">{data.n_lose}</div>
              <div className="stat-desc">{loss_percentage}% losses</div>
            </div>
          </div>
          <History userId={userId} />
        </div>
      </>
    );
  }
  return <></>;
}
