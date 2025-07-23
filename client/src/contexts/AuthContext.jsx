import React, { createContext, useContext, useState } from 'react'


const AuthContext = createContext();

export const useAuthContext= () => {return useContext(AuthContext)}



const AuthContextProvider = ({children}) => {

    const [isAuthenticated, setIsAuthenticated] = useState(undefined);
    const [user, setUser] = useState({name:'', email:''});


    const values={
        isAuthenticated,
        setIsAuthenticated,
        user,
        setUser
    }

  return (
    <AuthContext.Provider value={values}>
        {children}
    </AuthContext.Provider>
     
  )
}

export default AuthContextProvider;