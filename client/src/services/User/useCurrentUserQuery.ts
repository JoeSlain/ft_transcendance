import { useQuery } from "@tanstack/react-query";

export default function useCurrentUserQuery() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: () => {
      fetch(`http://localhost:3001/api/users`, {
        method: "GET",
        credentials: "include",
      });
    },
  });
}
