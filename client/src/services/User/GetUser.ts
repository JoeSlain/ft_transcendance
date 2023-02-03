import axios from "axios";
import { userType } from "../../types/userType";

export function getUser(id: string | undefined): Promise<userType> {
  return axios(`http://10.11.7.11:3001/api/users/userid/${id}`, {
    withCredentials: true,
  }).then((res) => res.data);
}
