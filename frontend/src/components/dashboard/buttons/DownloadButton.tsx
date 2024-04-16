import { useContext, useState } from "react";
import { EInvoiceItem } from "../../../data";
import ErrorPopup from "./ErrorPopup";
import {
  Box,
  Button, Dialog, DialogTitle,
  Grid
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import {
  downloadInvoices,
} from "../../../service/service";
import { AuthContext } from "../../../context/AuthContextProvider";

function DownloadPopup({ invoices, setPopup }: { invoices: EInvoiceItem[], Popup: boolean, setPopup: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const closePopup = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
        <DialogTitle>Downloading eInvoice</DialogTitle>
        <Button
          variant="contained"
          onClick={async () => {
            const invoiceNames = invoices.filter(invoice => invoice.checked).map(invoice => invoice.name);
            if (invoiceNames.length === 0) {
              window.alert('No invoices are selected');
              return;
            }
            try {
              await downloadInvoices(user!.username, user!.password, invoiceNames);
              setTimeout(closePopup, 1000);
            } catch (error) {
              console.error('Download failed:', error);
              window.alert('Download failed. Please try again later.');
            }
          }}
        >
          Download file(s)?
        </Button>
      </Dialog>
    </>
  )
}

export default function DownloadButton({ invoices }: { invoices: EInvoiceItem[] }) {
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
      <Button 
        variant="contained" 
        fullWidth 
				sx={{
					backgroundColor: "#7B54E8",
					'&:hover': {
						backgroundColor: "#6a47cd",
					}
				}}
        onClick={openPopup}
      >
        <Grid 
          container 
          justifyContent={"space-between"} 
          alignItems={"center"}
          wrap="nowrap"
        >
          <DownloadIcon /> Download <Box></Box> 
        </Grid>
      </Button>

      {Popup && <DownloadPopup Popup={Popup} setPopup={setPopup} invoices={invoices} />}
      {Error && <ErrorPopup Popup={Error} setPopup={setError} />}
    </>
  );
}