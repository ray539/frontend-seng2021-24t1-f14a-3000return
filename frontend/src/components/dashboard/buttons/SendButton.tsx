import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { EInvoiceItem } from "../../../data";
import {
  sendInvoicesByNames,
} from "../../../service/service";
import {
  Button, TextField, Typography
} from '@mui/material';

export default function SendPopUp({ invoices, setShowSendUI }: { invoices: EInvoiceItem[], showSendUI: boolean, setShowSendUI: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [emailListStr, setEmailListStr] = useState('');
  const [from, setFrom] = useState('');
  const [buttonText, setButtonText] = useState('SEND');

  return (
    <>
      <div>
        <Typography variant="h5">Send Checked Invoices</Typography>
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
            setTimeout(() => {
              setShowSendUI(false);
            }, 1000);

          }} disabled={buttonText !== 'SEND'}>{buttonText}</Button>
          <Button disabled={buttonText !== 'SEND'} onClick={() => setShowSendUI(false)}>Cancel</Button>
        </form>

      </div>
    </>
  )
}