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

function ManageInvoicePopup({ invoices, index, setPopup }: { invoices: EInvoiceItem[], index:number, Popup: boolean, setPopup: Function }) {
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
        <DialogTitle>Manage tags for {invoices[index].name}</DialogTitle>
        Hello world

      </Dialog>
    </>
  )
}

export default function ManageTagButton({invoices, index}: {invoices: EInvoiceItem[], index: number}) {
  const [Popup, setPopup] = useState(false);

  const openPopup = () => {
    setPopup(true)
  }

  return ( 
    <>
      <Button 
        variant="outlined" 
        onClick={openPopup}
      >
        Manage Tags:
      </Button>
      
      {Popup && <ManageInvoicePopup invoices={invoices} index={index} Popup={Popup} setPopup={setPopup} />}
    </>
  );
}