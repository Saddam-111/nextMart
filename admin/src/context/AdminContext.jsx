import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthDataContext } from "./AuthContext";


export const AdminDataContext = createContext()

function AdminContext({children}){
  const {baseUrl} = useContext(AuthDataContext)
  const [adminData, setAdminData] = useState(null)

  const getAdmin = async() => {
    try {
      const result = await axios.get(baseUrl+ "/api/v1/user/getAdmin", {withCredentials: true}) 
      setAdminData(result.data)
    } catch (error) {
      console.log(error)
      setAdminData(null)
    }
  }

  useEffect( () => {
    getAdmin()
  }, [baseUrl])



  const value = {
      adminData, setAdminData, getAdmin
  }

  return (
    <div>
      <AdminDataContext.Provider value={value}>
        {children}
      </AdminDataContext.Provider>
    </div>
  )
}


export default AdminContext