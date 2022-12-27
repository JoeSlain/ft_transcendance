import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useContext, useState } from "react";
import ReactCodeInput from "react-code-input";
import User from "../../../../hooks/User";
import { generate2fa } from "../../../../services/2FA/Generate2FA";
import { getUser } from "../../../../services/User/GetUser";

export default function TwoFa() {
  const {user} = useContext(User);
  const {
    isLoading: isUserLoading,
    error: userError,
    data: userData,
  } = useQuery({
    queryKey: ["userData", user.id],
    queryFn: ({ queryKey }) => getUser(queryKey[1].toString()),
  });

  const { isError, data, error, refetch } = useQuery({
    queryKey: ["generate2FA"],
    queryFn: generate2fa,
    enabled: false,
  });

  return (
    <>
      <button className="bg-white" onClick={() => refetch()}>
        {" "}
        generate 2fa{" "}
      </button>
      {isError && <div>error</div>}
      <img src={data}></img>

      {/* <div>
        <p> Enter code from GoogleAuthenticator app </p>
         <form onSubmit={send2faCode}>
            <ReactCodeInput
              type="text"
              fields={6}
              onChange={getCode}
              name={""}
              inputMode={"email"}
            />
            <button type="submit"> confirm </button>
          </form> *
      </div> */}
    </>
  );
}
