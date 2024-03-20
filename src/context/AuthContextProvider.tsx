import { ReactElement, createContext, useContext, useState } from "react";

interface UserProfile {
  username: string,
  setUsername: Function
  password: string,
  setPassword: Function
}

const AuthContext = createContext<UserProfile>({
  username: '',
  password: '',
  setUsername: () => null,
  setPassword: () => null
})

export default function AuthContextProvider({ children } : { children: ReactElement }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  return (
    <AuthContext.Provider value={{
      username: username,
      setUsername: setUsername,
      password: password,
      setPassword: setPassword
    }}>
      {children}
    </AuthContext.Provider>
  )
}
