import axios from "axios";
import { userType } from "../../types/userType";

export function updateUser(
  id: string | undefined,
  user: userType
): Promise<userType> {
  return axios
    .post(`http://10.11.7.11:3001/api/users/updateUser/${id}`, user, {
      withCredentials: true,
    })
    .then((res) => res.data);
}
