import React from "react";
import "../../styles/contact.css";
import Tabs from "../tabs/tabs";
import Tab from "../tabs/tab";

export default function Contact() {
	  return (
		<div className="contact">
			<Tabs>
      			<Tab title="Contact">Ici les contactsw</Tab>
      			<Tab title="Channel">ici les channel</Tab>
   			 </Tabs>
		</div>

	  );
}