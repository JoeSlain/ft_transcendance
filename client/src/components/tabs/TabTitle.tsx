import React from "react";
import "../../styles/tab.css";

type Props = {
	title: string;
	index: number;
	setSelectedTab: (index: number) => void;
}

const TabTitle: React.FC<Props> = ({ title, setSelectedTab, index }) => {

	return (
	  <li className="tab">
		<button onClick={() => setSelectedTab(index)}>{title}</button>
	 </li>
	);
}
export default TabTitle;