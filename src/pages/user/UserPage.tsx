import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GetStarted from "./GetStarted";
import UploadPage from "./UploadPage";
import CreationPage from "./CreationPage";
import { AuthContext } from "../../context/AuthContextProvider";
import { EInvoice, getInvoicesBelongingTo } from "../../data";

function Dashboard() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const [invoices, setInvoices] = useState<EInvoice[]>([])

  const renderedInvoices = invoices.map((invoice, i) => ({
    name: invoice.name,
    key: i
  }))

  useEffect(() => {
    // on mount get all invoices belonging to logged in user
    // must exist otherwise this page won't show
    setInvoices(getInvoicesBelongingTo(authContext.currentUser!.id));
  }, [])

  return (
    <>
      <h1>Welcome user</h1>
      <div>
        <h2>profile</h2>
        <div>username: {authContext.currentUser?.username}</div>
        <button onClick={() => {
          authContext.setCurrentUser(null)
          navigate("/")
        }}>logout</button>
      </div>
      <h2>your invoices</h2>
      <button
        onClick={() => {
          navigate("/user/get-started");
        }}
      >
        Get started
      </button>
      
      {renderedInvoices.map(i => <div key={i.key}>{i.name} <input type='checkbox'></input></div>)}

      <button>download</button>
      <button>render</button>
      <button>send</button>
      <button>delete</button>
    </>
  );
}

export function NotLoggedIn() {
  return (
    <>
    <h1>you are not logged in</h1>
    you must log into access features
    <Link to='/'>back</Link>
    </>
  )
}

/**
 * home page for logged in users
 */
export default function UserPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.currentUser == null ?
        <NotLoggedIn/> :
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/get-started" element={<GetStarted />}></Route>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/create" element={<CreationPage />} />
        </Routes>
      }

    </>
  );
}
