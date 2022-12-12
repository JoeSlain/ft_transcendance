import axios from "axios";

export default function avatarGenerator(seed: string): any {
  let avatar: any;
  axios.get<string>(
    `https://avatars.dicebear.com/api/adventurer-neutral/:${seed}.svg`,
    avatar
  );
  return avatar;
}
