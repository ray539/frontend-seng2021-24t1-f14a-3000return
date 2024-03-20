import { Link, Route, Routes } from "react-router-dom";
import CreationPage from "./CreationPage";
import RenderingPage from "./RenderingPage";
import SendingPage from "./SendingPage";

function UserHome() {
  return (
    <>
    <h2>select a service</h2>
    <div>
      <div>
        <Link to="/user/create-invoice">create invoice</Link>
      </div>
      <div>
        <Link to="/user/render-invoice">render invoice</Link>
      </div>
      <div>
        <Link to="/user/send-invoice">send invoice</Link>
      </div>
    </div>
    </>
  )
}

/**
 * home page for logged in users
 */
export default function UserPage() {
  return (
    <>
    <h1>Welcome user</h1>
    <Link to="/">logout</Link>
    <Routes>
      <Route path="/" element={<UserHome/>}></Route>
      <Route path="/create-invoice" element={<CreationPage/>}/>
      <Route path="/render-invoice" element={<RenderingPage/>}/>
      <Route path="/send-invoice" element={<SendingPage/>}/>
    </Routes>

    </>
    
  )
}
