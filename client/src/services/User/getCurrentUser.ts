import { userType } from "./../../types/userType";
import { BACK_ROUTE } from "./../back_route";
import axios from "axios";
import { useQuery, UseQueryResult } from "@tanstack/react-query";

export function UseCurrentUser() {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      axios
        .get(`${BACK_ROUTE}users/`)
        .then((res) => {
          return res.data as userType;
        })
        .catch((err) => {
          console.log(
            "🚀 ~ file: getCurrentUser.ts:12 ~ awaitaxios.get ~ err",
            err
          );
          return null;
        });
    },
  });
}
