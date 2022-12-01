import { useEffect } from "react"
import { Navigate } from "react-router-dom"

interface IRedirectProps {
    setIsLogged: (arg: boolean) => void
}

const Redirect: React.FC<IRedirectProps> = ({setIsLogged}) => {
    useEffect(() => {
        setIsLogged(true)
    })

    return (<Navigate to="/home" />)
}

export default Redirect;