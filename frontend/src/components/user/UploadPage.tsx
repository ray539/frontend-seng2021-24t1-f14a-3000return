import { Link } from "react-router-dom";

export default function UploadPage() {
  return (
    <>
      <h1>upload your invoice</h1>
      <div>
        We will run some validation checks before storing it in our database
      </div>
      <div>upload a file</div>
      <button>Submit</button>
      <button>download validation report</button>
      <button>store</button>
      <div>
        <Link to="/user/get-started">back</Link>
      </div>
    </>
  );
}
