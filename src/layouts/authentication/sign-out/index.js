import { useContext, useEffect } from "react";
import { AuthContext } from "context/AuthContext";
import { useNavigate } from "react-router-dom";

function SignOut() {
    const navigate = useNavigate()
    const ctx = useContext(AuthContext)
    useEffect(() => {
        // const logout = () => {
            if (window.confirm('Are you sure you want to log out ?')) {
              ctx.logout()
              navigate('/login')
            }
        //   }
    }, [])
    return <></>
}

export default SignOut