import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { logInAndGetUser } from "../data";

export default function LoginPage() {
  const navigate = useNavigate();
  const [usernameI, setUsernameI] = useState('');
  const [passwordI, setPasswordI] = useState('');
  const [showDiv, setShowDiv] = useState(false)
  const authContext = useContext(AuthContext)

  return (
    <>
      <h1>Login page</h1>
      <Link to = '/'>back</Link>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const user = logInAndGetUser(usernameI, passwordI);
          console.log(user)
          if (user == null) {
            setShowDiv(true)
            return;
          }
          
          console.log(user);
          
          authContext.setCurrentUser(user);
          navigate("/user");
        }}
        onFocus={() => setShowDiv(false)}
      >
        <div>
          username: <input value={usernameI} onChange={e => setUsernameI(e.target.value)}></input>
        </div>
        <div>
          password: <input value={passwordI} onChange={e => setPasswordI(e.target.value)}></input>
        </div>
        {showDiv && <div>incorrect username or password</div>}
        <button type="submit"> login </button>
      </form>
    </>
  );
}
