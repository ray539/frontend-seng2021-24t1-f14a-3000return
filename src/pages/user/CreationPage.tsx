import { Link } from "react-router-dom";


export default function CreationPage() {
  return (
    <>
    <h1>Creation page</h1>
    <div>
      create from file (coming soon)
    </div>
    <div>
      create from form
      <button>GO</button>
    </div>
    <div>
      <Link to="/user/get-started">back</Link>
    </div>
    </>
  )
}
