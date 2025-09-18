import React, { createContext } from 'react'

// Use PascalCase for context variables by convention
export const AuthDataContext = createContext()

function AuthContext({ children }) {
  const baseUrl = import.meta.env.VITE_BASE_URL

  const value = {
    baseUrl
  }

  return (
    <AuthDataContext.Provider value={value}>
      {children}
    </AuthDataContext.Provider>
  )
}

export default AuthContext
