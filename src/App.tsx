import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/LandingPage"
import UserPage from "./pages/user/UserPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import AuthContextProvider from "./context/AuthContextProvider"


function App() {

  return (
    <>
    <AuthContextProvider>
      <Routes>
        <Route path="/" element={<LandingPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}/>
        <Route path="/register" element={<RegisterPage/>}/>
        <Route path="/user/*" element={<UserPage/>}/>
      </Routes>
    </AuthContextProvider>
    </>
  )
}

export default App
