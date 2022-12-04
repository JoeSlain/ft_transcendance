import "../../styles/Home.css";
import "../../styles/global.css";
import "../../styles/contact.css";
import Contact from "../../components/contact/contact";
import React from "react";
import Auth from "../../hooks/Auth";

export default function Home() {
  const isLogged = React.useContext(Auth)
  console.log('isLogged', isLogged)
  
  return (
    <div className="center">
      <div className="container">
        <div className="main">
          <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero optio, quam blanditiis commodi neque ipsum laborum dolore, quaerat et animi cum nulla hic magnam dolorum rem dicta inventore. Soluta, voluptate!</p>
        </div>
        <div className="contact">
          <Contact/>
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