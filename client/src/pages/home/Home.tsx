import "../../styles/Home.css";
import "../../styles/global.css";
import React from "react";
import TabContact from "../../components/tabs/tab_contatc";
import VerifLogged from "../../pages/login/VerifLogged";
import Login from "../../pages/login/Login";

export default function Home() {
  const [isLogged] = React.useState(VerifLogged);
  if (isLogged) {
    return (
      <div className="center">
        <div className="container">
          <div className="main">
            <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero optio, quam blanditiis commodi neque ipsum laborum dolore, quaerat et animi cum nulla hic magnam dolorum rem dicta inventore. Soluta, voluptate!</p>
          </div>
          <div className="second">
            <TabContact />
          </div>
        </div>
      </div>

    );
  }
  else {
    return (
      <Login />
    );
  }
}