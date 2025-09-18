
import { createContext } from "react";

export const AuthDataContext = createContext()

function AuthContext({children}){

  const baseUrl = "http://localhost:3000"

  const value = {
    baseUrl
  }


  return(
    <div>
      <AuthDataContext.Provider value={value}>
        {children}
      </AuthDataContext.Provider>
    </div>
  )
}

export default AuthContext