import axios from "axios";
import { gameType } from "../../types/gameType";

export function getGames(id: string): Promise<gameType[]> {
  return axios(`http://10.11.7.11:3001/api/users/games/${id}`, {
    withCredentials: true,
  }).then((res) => res.data);
}
