import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { EInvoiceItem } from "../../../data";
import {
	deleteInvoicesFromUser,
} from "../../../service/service";
import ErrorPopup from "./ErrorPopup";
import {
  Button, Dialog, DialogTitle,
	Typography
} from '@mui/material';

function DeletePopup({ invoices, setPopup, setInvoices }: { invoices: EInvoiceItem[], Popup: boolean, setPopup: Function, setInvoices: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const closePopup = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
        <DialogTitle>Delete eInvoice</DialogTitle>
				<Typography variant="subtitle1">
					Are you sure you want to delete? Invoices will be permanently removed
				</Typography>
				<Button 
					variant="contained"
					sx={{
						backgroundColor: "#F22556",
						'&:hover': {
							backgroundColor: "#d71e4a",
						}
					}}
					onClick={async () => {
						const names = invoices
							.filter((invoice) => invoice.checked)
							.map((invoice) => invoice.name);
						await deleteInvoicesFromUser(
							user!.username,
							user!.password,
							names
						);

						setInvoices(invoices.filter((invoice) => !invoice.checked));
					}}
				>
					Delete
				</Button>
				<Button 
					variant="contained"
					sx={{
						backgroundColor: "#7B54E8",
						'&:hover': {
							backgroundColor: "#6a47cd",
						}
					}}
					onClick={closePopup}
				>
					Cancel
				</Button>

      </Dialog>
    </>
  )
}

export default function DeleteButton({invoices, setInvoices}: {invoices : EInvoiceItem[], setInvoices: Function } ) {
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
					backgroundColor: "#F22556",
					'&:hover': {
						backgroundColor: "#d71e4a",
					}
				}}
				onClick={openPopup}
			>
				Delete
			</Button>
      
      {Popup && <DeletePopup invoices={invoices} Popup={Popup} setPopup={setPopup} setInvoices={setInvoices} />}
      {Error && <ErrorPopup Popup={Error} setPopup={setError}/>}
    </>
  );
}