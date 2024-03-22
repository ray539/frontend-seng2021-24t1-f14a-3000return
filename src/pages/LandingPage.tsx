import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";

export default function LandingPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      <h1>Landing Page</h1>
      <div>
        {authContext.currentUser == null ? (
          <div>
            <div>
              <Link to="/login"> login </Link>
            </div>
            <div>
              <Link to="/register"> register </Link>
            </div>
          </div>
        ) : (
          <div>
            <div>
            you are already logged in
            </div>
            
            <Link to="/user"> go to dashboard </Link>
          </div>
        )}
      </div>
      <h2>3000 return e-invoice application</h2>
      replace with description of our application
    </>
  );
}
