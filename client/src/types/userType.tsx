import { gameType } from "./gameType";

export type userType = {
  id: number;
  username: string;
  email: string;
  //twoFactorAuthenticationSecret?: string;
  isTwoFactorAuthenticationEnabled: boolean;
  id42: number;
  winratio: string;
  profile_pic: string;
  avatar: string | null;
  elo: number;
  n_win: number;
  n_lose: number;
  date_of_sign: Date;
  blocked?: number[];
  games: gameType[];
};
