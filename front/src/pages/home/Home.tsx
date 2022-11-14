import "../../styles/Home.css";
import "../../styles/global.css";
import Contact from "../../components/contact/contact";

export default function Home() {
  return (
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