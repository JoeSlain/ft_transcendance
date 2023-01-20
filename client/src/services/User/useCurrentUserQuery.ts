import { userType } from './../../types/userType';
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

async function getCurrentUser(): Promise<userType> {
  return await axios.get(`http://localhost:3001/api/users`, {withCredentials: true}).then((res) => res.data);
}

export default function useCurrentUserQuery() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });
}
