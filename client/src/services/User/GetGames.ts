import axios from "axios";
import { gameType } from "../../types/gameType";

export function getGames(id: string): Promise<gameType[]> {
  return axios(`http://localhost:3001/api/users/games/${id}`, {
    withCredentials: true,
  }).then((res) => res.data);
}
