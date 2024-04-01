import { Link, Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
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
  sendInvoicesByNames,
} from "../../service/service";

function SendUI({invoices, setShowSendUI}: {invoices: EInvoiceItem[], showSendUI: boolean, setShowSendUI: Function}) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  // const [emailList, setEmailList] = useState<string[]>([])
  const [emailListStr, setEmailListStr] = useState('')
  const [from, setFrom] = useState('')
  const [buttonText, setButtonText] = useState('SEND')

  return (
    <>
      <div>
        <h2>send checked invoices</h2>
        <form onSubmit={(e) => {
          e.preventDefault()
        }}>
          <div>
            Recipient emails (comma separated):
            <input type='text' value={emailListStr} onChange={(e) => setEmailListStr(e.target.value)}></input>
          </div>
          <div>
            From:
            <input type='text' value={from} onChange={(e) => setFrom(e.target.value)}></input>
          </div>
          <button onClick={async () => {
            const emails = emailListStr.split(',').filter(e => e !== '');
            if (emails.length == 0) {
              window.alert('enter at least one email')
              return;
            }
            // get list of checked invoice names
            const invoiceNames = invoices.filter(invoice => invoice.checked).map(invoice => invoice.name);
            if (invoiceNames.length == 0) {
              window.alert('no invoices are selected')
              return;
            }

            if (!from) {
              window.alert('please fill out field: from')
            }

            setButtonText('SENDING...')
            const res = await sendInvoicesByNames(user!.username, user!.password, invoiceNames, emails, from);
            if (!res.success) {
              window.alert('send failed')
              return;
            }
            setButtonText('SENT')
            setTimeout(() => {
              setShowSendUI(false)
            }, 1000)

          }}
          disabled={buttonText != 'SEND'}
          >{buttonText}</button>
          <button disabled={buttonText != 'SEND'} onClick={() => setShowSendUI(false)}>cancel</button>
        </form>

      </div>
    </>
  )
}

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

  const [showSendUI, setShowSendUI] = useState(false)

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
            <button
              onClick={() => {
                window.open(`/user/view-invoice/${invoice.name}`);
              }}
            >
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

      <button onClick={() => {
        if (!invoices.find(i => i.checked)) {
          return;
        }
        setShowSendUI(true)}
      }>send</button>


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

      {showSendUI && <SendUI invoices={invoices} showSendUI={showSendUI} setShowSendUI={setShowSendUI} />}

      {deletedConfirmation.state != "hidden" && (
        <div>
          {deletedConfirmation.state == "shown" ? (
            <>
            <h2>delete items</h2>
            <div>Delete these {deletedConfirmation.numItems} items?'</div>
            </>
            
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

function InvoiceView() {
  const authContext = useContext(AuthContext);
  // const params = useParams();
  const user = authContext.currentUser;

  const { invoiceName } = useParams();
  const [xmlData, setXmlData] = useState("fetching...");

  useEffect(() => {
    console.log(invoiceName);
    if (!invoiceName) {
      setXmlData("your invoice couldn't be loaded");
    }

    getXmlData(user!.username, user!.password, invoiceName!).then((data) => {
      if (data == null) {
        setXmlData("your invoice couldn't be loaded");
        return;
      }
      setXmlData(data);
    });
  }, []);

  return (
    <>
      <h1>{invoiceName}</h1>
      <pre>{xmlData}</pre>
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
          <Route path="/create/*" element={<CreationPage />} />
          <Route
            path="/view-invoice/:invoiceName"
            element={<InvoiceView />}
          ></Route>
          {/* <Route path="/send-invoices/:ids" element={<SendPage/>}/> */}
        </Routes>
      )}
    </>
  );
}
