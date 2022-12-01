import axios from "axios"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { userType } from "../../types/userType"
import { saveItem } from "../../utils/storage"

interface IRedirectProps {
    setIsLogged: (arg: boolean) => void
    setUser: (arg: userType) => void
}

const Redirect: React.FC<IRedirectProps> = ({setIsLogged, setUser}) => {
    const navigate = useNavigate()

    useEffect(() => {
        axios(`http://localhost:3001/api/users`, {withCredentials: true})
        .then((res) =>
        {
          console.log("User found: " + res.data.username);
          setUser(res.data);
          setIsLogged(true);
          saveItem('user', res.data);
          saveItem('isLogged', true);
          navigate("/home");
        })
        .catch((e) => {console.log("User not found " + e);});
      }, []);

      return (<></>)
}

export default Redirect;