import { ReactElement, createContext, useState } from "react";
import { UserProfile } from "../data";

interface AuthContextT {
  currentUser: UserProfile | null,
  setCurrentUser: Function
}

export const AuthContext = createContext<AuthContextT>({
  currentUser: null,
  setCurrentUser: () => null
})

export default function AuthContextProvider({ children }: { children: ReactElement }) {
  const [currentUser, setCurrentUser] = useState(null)

  return (
    <AuthContext.Provider value={{
      currentUser: currentUser,
      setCurrentUser: setCurrentUser
    }}>
      {children}
    </AuthContext.Provider>
  )
}
