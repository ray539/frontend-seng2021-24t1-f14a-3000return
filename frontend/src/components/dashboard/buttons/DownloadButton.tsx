import { useState } from "react";
import { EInvoiceItem } from "../../../data";
import ErrorPopup from "./ErrorPopup";
import {
  Button, Dialog, DialogTitle
} from '@mui/material';

function DownloadPopup({ setPopup }: { Popup: boolean, setPopup: Function }) {
  // const authContext = useContext(AuthContext);
  // const user = authContext.currentUser;

  const closePopup = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
        <DialogTitle>Downloading eInvoice</DialogTitle>
      </Dialog>
    </>
  )
}

export default function DownloadButton({invoices}: {invoices : EInvoiceItem[]} ) {
  const [Popup, setPopup] = useState(false);
  const [Error, setError] = useState(false);

  const openPopup = () => {
    if (!invoices.find(i => i.checked)) {
      setError(true);
    } else {
      setPopup(true);
    }
  }

  return ( 
    <>
      <Button variant="contained" fullWidth onClick={openPopup}>
        Download
      </Button>
      
      {Popup && <DownloadPopup Popup={Popup} setPopup={setPopup} />}
      {Error && <ErrorPopup Popup={Error} setPopup={setError}/>}
    </>
  );
}