import { useContext } from "react";
import { ChatContext } from "../../context/socketContext";
import { userType } from "../../types/userType";

export type UserProps = {
  user?: userType;
};

export const UserContextList = ({ user }: UserProps) => {
  const socket = useContext(ChatContext);
  const handleInvite = () => {
    console.log(user);
  };
  const handleDelete = () => {
    console.log(user);
  };
  const handleSpectate = () => {
    console.log(user);
  };

  return (
    <ul>
      <li onClick={handleInvite}> Invite </li>
      <li> Block </li>
      <li onClick={handleDelete}> Delete </li>
      <li onClick={handleSpectate}> Spectate </li>
    </ul>
  );
};
