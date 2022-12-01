import "../../styles/global.css";
import "../../styles/login.css";
import React from "react";

export function VerifLogged()
{
    return false;
}

export default function Login() {
  const buttonAuth = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    window.location.assign("http://localhost:3001/api/auth/login");
  };

  return (
    <div className="back">
      <div className="titre">
        <p>TRANSCENDANCE </p>
        <p>Play for fun on PongGame </p>
      </div>

      <div>
        <button onClick={buttonAuth} className="button-auth" name="button 1">
          Connect with 42
        </button>
      </div>
    </div>
  );
}
