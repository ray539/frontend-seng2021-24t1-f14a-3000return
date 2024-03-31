/* eslint-disable @typescript-eslint/ban-types */
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
import { Button, Form } from 'react-bootstrap';

function SendUI({ invoices, setShowSendUI }: { invoices: EInvoiceItem[], showSendUI: boolean, setShowSendUI: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [emailListStr, setEmailListStr] = useState('');
  const [from, setFrom] = useState('');
  const [buttonText, setButtonText] = useState('SEND');

  return (
    <>
      <div>
        <h2>Send Checked Invoices</h2>
        <Form onSubmit={(e) => { e.preventDefault() }}>
          <Form.Group>
            <Form.Label>Recipient emails (comma separated):</Form.Label>
            <Form.Control type='text' value={emailListStr} onChange={(e) => setEmailListStr(e.target.value)} />
          </Form.Group>
          <Form.Group>
            <Form.Label>From:</Form.Label>
            <Form.Control type='text' value={from} onChange={(e) => setFrom(e.target.value)} />
          </Form.Group>
          <Button onClick={async () => {
            const emails = emailListStr.split(',').filter(e => e !== '');
            if (emails.length == 0) {
              window.alert('Enter at least one email');
              return;
            }
            const invoiceNames = invoices.filter(invoice => invoice.checked).map(invoice => invoice.name);
            if (invoiceNames.length == 0) {
              window.alert('No invoices are selected');
              return;
            }

            if (!from) {
              window.alert('Please fill out the "From" field');
              return;
            }

            setButtonText('SENDING...');
            const res = await sendInvoicesByNames(user!.username, user!.password, invoiceNames, emails, from);
            if (!res.success) {
              window.alert('Send failed');
              return;
            }
            setButtonText('SENT');
            setTimeout(() => {
              setShowSendUI(false);
            }, 1000);

          }} disabled={buttonText !== 'SEND'}>{buttonText}</Button>
          <Button disabled={buttonText !== 'SEND'} onClick={() => setShowSendUI(false)}>Cancel</Button>
        </Form>

      </div>
    </>
  )
}

function Dashboard() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);
  const [showSendUI, setShowSendUI] = useState(false);

  const [deletedConfirmation, setDeleteConfirmation] = useState<{
    state: "hidden" | "shown" | "loading";
    numItems: number;
  }>({
    state: "hidden",
    numItems: 0,
  });

  useEffect(() => {
    console.log(user?.username, user?.password);
    getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
      setInvoices(invoices)
    );
  }, []);

  function changePdfButtonMsg(
    msg:
      | "generate pdf"
      | "fetching xml..."
      | "generating..."
      | "an error occured :(",
    i: number
  ) {
    const invoices_ = [...invoices];
    invoices_[i].pdfGenMsg = msg;
    setInvoices(invoices_);
  }

  return (
    <>
      <h1>Welcome, {authContext.currentUser?.username}</h1>
      <div>
        <h2>Profile</h2>
        <div>Username: {authContext.currentUser?.username}</div>
        <Button onClick={() => {
          authContext.setCurrentUser(null);
          navigate("/");
        }}>Logout</Button>
      </div>
      <h2>Your Invoices</h2>
      <Button onClick={() => {
        navigate("/user/get-started");
      }}>Get Started</Button>

      {invoices.length == 0 ? (
        <div>None</div>
      ) : (
        invoices.map((invoice, i) => (
          <div key={invoice.id}>
            {invoice.name}
            <Button onClick={() => {
              window.open(`/user/view-invoice/${invoice.name}`);
            }}>View XML</Button>

            <Button onClick={async () => {
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
              setTimeout(() => window.open(link), 100);
            }}>{invoice.pdfGenMsg}</Button>

            <Form.Check
              type="checkbox"
              checked={invoice.checked}
              onChange={(e) => {
                const invoices_ = [...invoices];
                invoices_[i].checked = e.target.checked;
                setInvoices(invoices_);
              }}
            />
          </div>
        ))
      )}

      <Button>Download</Button>

      <Button onClick={() => {
        if (!invoices.find(i => i.checked)) {
          return;
        }
        setShowSendUI(true);
      }}>Send</Button>


      <Button onClick={() => {
        const numItems = invoices.filter((invoice) => invoice.checked).length;
        if (numItems == 0) return;
        setDeleteConfirmation({
          state: "shown",
          numItems: numItems,
        });
      }}>Delete</Button>

      {showSendUI && <SendUI invoices={invoices} showSendUI={showSendUI} setShowSendUI={setShowSendUI} />}

      {deletedConfirmation.state != "hidden" && (
        <div>
          {deletedConfirmation.state == "shown" ? (
            <>
              <h2>Delete Items</h2>
              <div>Delete these {deletedConfirmation.numItems} items?'</div>
            </>

          ) : (
            <div>Loading</div>
          )}
          <Button onClick={async () => {
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
          }}>Yes</Button>
          <Button onClick={() =>
            setDeleteConfirmation({ ...deletedConfirmation, state: "hidden" })
          }>No</Button>
        </div>
      )}
    </>
  );
}

export function NotLoggedIn() {
  return (
    <>
      <h1>You are not logged in</h1>
      <p>You must log in to access features</p>
      <Link to="/">Back</Link>
    </>
  );
}

function InvoiceView() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const { invoiceName } = useParams();
  const [xmlData, setXmlData] = useState("Fetching...");

  useEffect(() => {
    console.log(invoiceName);
    if (!invoiceName) {
      setXmlData("Your invoice couldn't be loaded");
    }

    getXmlData(user!.username, user!.password, invoiceName!).then((data) => {
      if (data == null) {
        setXmlData("Your invoice couldn't be loaded");
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
          <Route
            path="/view-invoice/:invoiceName"
            element={<InvoiceView />}
          ></Route>
        </Routes>
      )}
    </>
  );
}
