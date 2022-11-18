import React from "react";
import "../../styles/tab.css";
import Tabs from "./tabs";
import Tab from "./tab";
import Channel from "../channel/channel";
import Contact from "../contact/contact";

export default function TabContact() {
	return (
		<div className="containers">
			<div className="tabs">
				<Tabs>
					<Tab title="Contact">
						<Contact/>
					</Tab>
					<Tab title="Channel">
						<Channel/>
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}