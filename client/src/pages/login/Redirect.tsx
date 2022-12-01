import axios from "axios"
import { useEffect } from "react"
import { Navigate } from "react-router-dom"
import { userType } from "../../types/userType"

interface IRedirectProps {
    setIsLogged: (arg: boolean) => void
    setUser: (arg: userType) => void
}

const Redirect: React.FC<IRedirectProps> = ({setIsLogged, setUser}) => {
    useEffect(() => {
        setIsLogged(true)
    })

    useEffect(() => {
        axios(`http://localhost:3001/api/users`, {withCredentials: true})
        .then((res) =>
        {
          console.log("User found: " + res.data.username);
          setUser(res.data);
        })
        .catch((e) => {console.log("User not found " + e);});
      }, []);

    return (<Navigate to="/home" />)
}

export default Redirect;