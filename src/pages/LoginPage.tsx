import { Link, useNavigate } from "react-router-dom";

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <>
      <h1>Login page</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          navigate("/user");
        }}
      >
        <div>
          username: <input></input>
        </div>
        <div>
          password: <input></input>
        </div>
        <button type="submit"> login </button>
      </form>
    </>
  );
}
