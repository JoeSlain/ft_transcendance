import { userType } from "../../types/userType";
import ProfileNavbar from "./Navbar";

export default function Stats(props: { user: userType }) {
  console.log("Stats");
  return (
    <>
      <ProfileNavbar userId={props.user.id} />
      <h1>Stats</h1>
    </>
  );
}
