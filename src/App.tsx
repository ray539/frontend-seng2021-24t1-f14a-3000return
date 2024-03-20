import { Route, Routes } from "react-router-dom"
import GuestPage from "./pages/GuestPage"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RenderingPage from "./pages/RenderingPage"


function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<GuestPage/>}></Route>
      <Route path="/login" element={<LoginPage/>}/>
      <Route path="/home" element={<HomePage/>}/>
      <Route path="/render" element={<RenderingPage/>}/>
    </Routes>
    </>
  )
}

export default App
