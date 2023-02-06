import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useGenerate2FA() {
  return useQuery({
    queryKey: ["generate2FA"],
    queryFn: generate2fa,
    enabled: false,
  });
}

/*export function useTurnOn2FA() {
  return useQuery({
    queryKey: ["turnOn2FA"],
    queryFn: turnOn2FA,
    enabled: false,
  });
}*/

export async function generate2fa() {
  const res = await fetch("http://10.11.7.11:3001/api/auth/2fa/generate", {
    method: "POST",
    credentials: "include",
    body: "",
  });
  console.log("res", res);
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function turnOn2FA(code: string) {
  return axios
    .post(
      "http://10.11.7.11:3001/api/auth/2fa/turn-on",
      { code },
      {
        withCredentials: true,
      }
    )
    .then((res) => res.data);
}
