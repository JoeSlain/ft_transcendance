import { useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import User from "../../hooks/User";

export function useGenerate2FA() {
  return useQuery({
    queryKey: ["generate2FA"],
    queryFn: generate2fa,
    enabled: false,
  });
}

export function useTurnOn2FA() {
  return useQuery({
    queryKey: ["turnOn2FA"],
    queryFn: turnOn2FA,
    enabled: false,
  });
}

export async function generate2fa() {
  const res = await fetch("http://localhost:3001/api/auth/2fa/generate", {
    method: "POST",
    credentials: "include",
    body: "",
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}

export async function turnOn2FA() {
  const res = await fetch("http://localhost:3001/api/auth/2fa/turn-on", {
    method: "POST",
    credentials: "include",
  });
  return res;
}
