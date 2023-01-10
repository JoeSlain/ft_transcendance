import { useQuery } from "@tanstack/react-query";
import { getUser } from "./GetUser";

export default function useUserQuery(userId: string) {
    return useQuery({
    queryKey: ["userData", userId],
    queryFn: ({ queryKey }) => getUser(queryKey[1])
  })
}