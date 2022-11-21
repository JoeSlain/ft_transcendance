import "../../styles/global.css";
import "../../styles/login.css";
import React from "react";
import { useEffect, useState } from "react"
import axios from "axios"

const VerifLogged = () => {
  const [isLogged, setIsLogged] = useState(Boolean);
	useEffect(() => {
		axios
			.get(`http://localhost:3001/api/users/IsLogged`, {
				withCredentials: true
			})
			.then(response => {
				console.log(response.data)
				setIsLogged(response.data)
			})
	}, [])
	/*return isLogged*/
	return true

}

export default VerifLogged;