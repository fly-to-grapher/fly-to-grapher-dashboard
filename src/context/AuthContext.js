import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = (props) => {
    const [token, setToken] = useState(window.localStorage.getItem('token'))
    const [isAuthenticated, setIsAuthenticated] = useState(!!token)
    const [user, setUser] = useState(JSON.parse(window.localStorage.getItem('user') || '{}'))
    
    const login = (response) => {
        setToken(response.token)
        setUser(response.data)
        window.localStorage.setItem('token', response.token)
        window.localStorage.setItem('user', JSON.stringify(response.data))
        setIsAuthenticated(true)
    }
    const logout = () => {
        setToken(null)
        setUser({})
        window.localStorage.removeItem('token')
        window.localStorage.removeItem('user')
        setIsAuthenticated(false)
    }
    return <AuthContext.Provider value={{
        isAuthenticated,
        token,
        login,
        logout,
        user
    }}>
        {props.children}
    </AuthContext.Provider>
}