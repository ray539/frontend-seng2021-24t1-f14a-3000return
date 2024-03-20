import { Route, Routes } from "react-router-dom"
import GuestPage from "./pages/GuestPage"
import UserPage from "./pages/user/UserPage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<GuestPage/>}></Route>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/register" element={<RegisterPage/>}/>
      <Route path="/user/*" element={<UserPage/>}/>
    </Routes>
    </>
  )
}

export default App
