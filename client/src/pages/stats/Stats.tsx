import { useQuery } from "@tanstack/react-query";
import { getUser } from "../../services/User/GetUser";
import "../../styles/global.css";
import CSS from "csstype";
import History from "./History";
import ProfileNavbar from "../profil/Navbar";

const win: CSS.Properties = {
  backgroundColor: "#4ade80",
};
const lose: CSS.Properties = {
  backgroundColor: "#f87171",
};

export default function Stats(props: { userId: number }) {
  //get user
  let { isLoading, data, error } = useQuery({
    queryKey: ["userData", props.userId],
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
    data.n_win = 7;
    data.n_lose = 3;
    return (
      <>
        <ProfileNavbar userId={props.userId} />

        <div className="flex flex-col justify-center gap-10 items-center pt-5 ">
          <div className="stats shadow mb-5 justify-center">
            <div className="stat " style={win}>
              <div className="stat-title">Wins</div>
              <div className="stat-value">{data.n_win}</div>
              <div className="stat-desc">
                {(data.n_win / (data.n_lose + data.n_win)) * 100}% wins
              </div>
            </div>
            <div className="stat ">
              <div className="stat-title">Elo</div>
              <div className="stat-value">{data.elo}</div>
            </div>
            <div className="stat " style={lose}>
              <div className="stat-title">Losses</div>
              <div className="stat-value">{data.n_lose}</div>
              <div className="stat-desc">
                {(data.n_lose / (data.n_lose + data.n_win)) * 100}% losses
              </div>
            </div>
          </div>
          <History userId={props.userId} />
        </div>
      </>
    );
  }
  return <></>;
}
