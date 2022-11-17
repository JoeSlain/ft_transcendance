import "../../styles/Home.css";
import "../../styles/global.css";
import Contact from "../../components/tabs/tab_contatc";

export default function Home() {
  return (
    <div className="center">
      <div className="container">
        <div className="main">
          <p> Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero optio, quam blanditiis commodi neque ipsum laborum dolore, quaerat et animi cum nulla hic magnam dolorum rem dicta inventore. Soluta, voluptate!</p>
        </div>
        <div className="second">
          <Contact/>
        </div>
      </div>
    </div>

  );
}