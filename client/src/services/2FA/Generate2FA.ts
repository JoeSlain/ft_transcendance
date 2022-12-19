export async function generate2fa() {
  const res = await fetch("http://localhost:3001/api/auth/2fa/generate", {
    method: "POST",
    credentials: "include",
  });
  const blob = await res.blob();
  return URL.createObjectURL(blob);
}
