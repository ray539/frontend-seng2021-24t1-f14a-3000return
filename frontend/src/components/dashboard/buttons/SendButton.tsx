import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { EInvoiceItem } from "../../../data";
import {
  sendInvoicesByNames,
} from "../../../service/service";
import ErrorPopup from "./ErrorPopup";
import {
  Button, Dialog, DialogTitle, TextField
} from '@mui/material';
import LockIcon from '@mui/icons-material/Lock';

function SendPopup({ invoices, setPopup }: { invoices: EInvoiceItem[], Popup: boolean, setPopup: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [emailListStr, setEmailListStr] = useState('');
  const [from, setFrom] = useState('');
  const [buttonText, setButtonText] = useState('SEND');

  const closePopup = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
        <DialogTitle>Send eInvoice</DialogTitle>
        <form onSubmit={(e) => { e.preventDefault() }}>
          <TextField
            fullWidth
            label="Recipient emails (comma separated)"
            value={emailListStr}
            onChange={(e) => setEmailListStr(e.target.value)}
          />
          <TextField
            fullWidth
            label="From"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
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
            setTimeout(closePopup, 1000);

          }} disabled={buttonText !== 'SEND'}>{buttonText}</Button>
          <Button disabled={buttonText !== 'SEND'} onClick={closePopup}>Cancel</Button>
        </form>

      </Dialog>
    </>
  )
}

export default function SendButton({ invoices }: { invoices: EInvoiceItem[] }) {
  const [Popup, setPopup] = useState(false);
  const [Error, setError] = useState(false);
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const openPopup = () => {
    if (!invoices.find(i => i.checked)) {
      setError(true);
    } else {
      setPopup(true);
    }
  }

  return (
    <>
      {user && user.accountType === "Premium" ? (
        <Button
          variant="contained"
          fullWidth
          onClick={openPopup}
          sx={{
            backgroundColor: "#7B54E8",
            '&:hover': {
              backgroundColor: "#6a47cd",
            }
          }}
        >
          Send
        </Button>
      ) : (
        <Button
          variant="contained"
          fullWidth
          disabled
          endIcon={<LockIcon />}
        >
          Send
        </Button>
      )}

      {Popup && <SendPopup invoices={invoices} Popup={Popup} setPopup={setPopup} />}
      {Error && <ErrorPopup Popup={Error} setPopup={setError} />}
    </>
  );
}