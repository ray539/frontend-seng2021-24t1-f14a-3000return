import { Link, useNavigate } from "react-router-dom";

export default function GetStarted() {
  const navigate = useNavigate();
  
  return (
    <>
    <h1>How do you wish to create the invoice?</h1>
    <div>
      <div>Have a file already?</div>
      <div>upload existing E-invoice</div>
      <button onClick={() => navigate('/user/upload')}>GO</button>
    </div>
    <div>
      <div>Create one from scratch</div>
      <button onClick={() => navigate('/user/create')}>GO</button>
    </div>
    <Link to="/user">back</Link>
    </>
    
  )
}