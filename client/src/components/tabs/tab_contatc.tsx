import React from "react";
import "../../styles/tab.css";
import Tabs from "./tabs";
import Tab from "./tab";
import Channel from "../channel/channel";

export default function Contact() {
	return (
		<div className="container">
			<div className="tabs">
				<Tabs>
					<Tab title="Contact">
						ici les contact
					</Tab>
					<Tab title="Channel">
					ici les chqnnel
					</Tab>
				</Tabs>
			</div>
		</div>
	);
}