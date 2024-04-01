import { Link, Route, Routes, useNavigate } from "react-router-dom";
import CreationForm from "./CreationForm";

function Default() {
  const navigate = useNavigate();
  return (
    <>
    <h1>Creation page</h1>
    <div>
      create from file (coming soon)
    </div>
    <div>
      create from form
      <button onClick={() => navigate('/user/create/form')}>GO</button>
    </div>
    <div>
      <Link to="/user/get-started">back</Link>
    </div>
    </>
  )
}

export default function CreationPage() {
  return (
    <Routes>
      <Route path="/" element={<Default/>}/>
      <Route path="/form" element={<CreationForm />}/>
    </Routes>
  )
}
