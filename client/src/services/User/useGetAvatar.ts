import { BACK_ROUTE } from "../back_route";

export default async function getAvatar(userId: number) {
  const res = await fetch(`${BACK_ROUTE}users/getAvatar/${userId}`, {
    method: "GET",
    credentials: "include",
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
