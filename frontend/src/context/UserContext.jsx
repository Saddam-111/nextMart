import axios from "axios";
import { createContext, useEffect, useState } from "react";



export const userDataContext = createContext()
function UserContext({children}){
  const [userData, setUserData] = useState(null)
  const baseUrl = import.meta.env.VITE_BASE_URL



  const getCurrentUser = async () => {
    try {
      const result = await axios.get(baseUrl + "/api/v1/user/getCurrentUser", {withCredentials: true})
      setUserData(result.data)
      console.log(result.data)

    } catch (error) {
      setUserData(null)
      console.log(error)
    }
  }

  useEffect( () => {
    getCurrentUser()
  }, [baseUrl])





  const value = {
      userData, setUserData, getCurrentUser, baseUrl
  }

  
  return (
    <div>
      <userDataContext.Provider value={value}>
        {children}
      </userDataContext.Provider>
    </div>
  )
}

export default UserContext