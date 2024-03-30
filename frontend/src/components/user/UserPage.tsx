import { Link, Route, Routes, useNavigate } from "react-router-dom";
import React, { useContext, useEffect, useState } from "react";
import GetStarted from "./GetStarted";
import UploadPage from "./UploadPage";
import CreationPage from "./CreationPage";
import { AuthContext } from "../../context/AuthContextProvider";
import { EInvoiceItem } from "../../data";
import {
  deleteInvoicesFromUser,
  getInvoicesBelongingTo,
  getPdfLink,
  getXmlData,
} from "../../service/service";

function Dashboard() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);

  const [deletedConfirmation, setDeleteConfirmation] = useState<{
    state: "hidden" | "shown" | "loading";
    numItems: number;
  }>({
    state: "hidden",
    numItems: 0,
  });

  useEffect(() => {
    // on mount get all invoices belonging to logged in user
    // must exist otherwise this page won't show
    console.log(user?.username, user?.password);
    getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
      setInvoices(invoices)
    );
    // setInvoices(getInvoicesBelongingTo(authContext.currentUser!.id));
  }, []);

  function changePdfButtonMsg(
    msg:
      | "generate pdf"
      | "fetching xml..."
      | "generating..."
      | "an error occured :(",
    i: number
  ) {
    let invoices_ = [...invoices];
    invoices_[i].pdfGenMsg = msg;
    setInvoices(invoices_);
  }

  return (
    <>
      <h1>Welcome user</h1>
      <div>
        <h2>profile</h2>
        <div>username: {authContext.currentUser?.username}</div>
        <button
          onClick={() => {
            authContext.setCurrentUser(null);
            navigate("/");
          }}
        >
          logout
        </button>
      </div>
      <h2>your invoices</h2>
      <button
        onClick={() => {
          navigate("/user/get-started");
        }}
      >
        Get started
      </button>

      {invoices.length == 0 ? (
        <div>none</div>
      ) : (
        invoices.map((invoice, i) => (
          <div key={invoice.id}>
            {invoice.name}
            <button>
              <a>view xml</a>
            </button>

            <button
              onClick={async () => {
                // get the service layer to generate a pdf
                changePdfButtonMsg("fetching xml...", i);
                const xmlData = await getXmlData(
                  user!.username,
                  user!.password,
                  invoice.name
                );
                console.log(xmlData);

                changePdfButtonMsg("generating...", i);
                const link = await getPdfLink(
                  user!.username,
                  user!.password,
                  xmlData
                );
                if (!link) {
                  changePdfButtonMsg("an error occured :(", i);
                  setTimeout(() => changePdfButtonMsg("generate pdf", i), 1000);
                  return;
                }

                changePdfButtonMsg("generate pdf", i);
                // open the window in a new tab
                setTimeout(() => window.open(link), 100);
              }}
            >
              {invoice.pdfGenMsg}
            </button>

            <input
              type="checkbox"
              checked={invoice.checked}
              onChange={(e) => {
                let invoices_ = [...invoices];
                invoices_[i].checked = e.target.checked;
                setInvoices(invoices_);
              }}
            />
          </div>
        ))
      )}

      <button>download</button>
      <button>render</button>
      <button>send</button>
      <button
        onClick={() => {
          const numItems = invoices.filter((invoice) => invoice.checked).length;
          if (numItems == 0) return;
          setDeleteConfirmation({
            state: "shown",
            numItems: numItems,
          });
        }}
      >
        delete
      </button>

      {deletedConfirmation.state != "hidden" && (
        <div>
          {deletedConfirmation.state == "shown" ? (
            <div>Delete these {deletedConfirmation.numItems} items?'</div>
          ) : (
            <div>LOADING</div>
          )}
          <button
            onClick={async () => {
              const names = invoices
                .filter((invoice) => invoice.checked)
                .map((invoice) => invoice.name);
              setDeleteConfirmation({
                ...deletedConfirmation,
                state: "loading",
              });
              await deleteInvoicesFromUser(
                user!.username,
                user!.password,
                names
              );

              setInvoices(invoices.filter((invoice) => !invoice.checked));
              setDeleteConfirmation({
                ...deletedConfirmation,
                state: "hidden",
              });
            }}
          >
            {" "}
            yes
          </button>
          <button
            onClick={() =>
              setDeleteConfirmation({ ...deletedConfirmation, state: "hidden" })
            }
          >
            {" "}
            no{" "}
          </button>
        </div>
      )}
    </>
  );
}

export function NotLoggedIn() {
  return (
    <>
      <h1>you are not logged in</h1>
      you must log into access features
      <Link to="/">back</Link>
    </>
  );
}


/**
 * home page for logged in users
 */
export default function UserPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.currentUser == null ? (
        <NotLoggedIn />
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/get-started" element={<GetStarted />}></Route>
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/create" element={<CreationPage />} />
        </Routes>
      )}
    </>
  );
}
