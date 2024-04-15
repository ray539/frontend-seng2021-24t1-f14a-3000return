// import { useState } from "react";
import {
  Button, Dialog,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { EInvoiceItem } from '../../../data';
import LockIcon from '@mui/icons-material/Lock';


function GetStartedPopup({ setPopup }: { Popup: boolean, setPopup: Function }) {
  const navigate = useNavigate();

  const closePopup = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog
        maxWidth={"md"}
        onClose={closePopup}
        open
      >
        <Grid
          container
          padding={"20px"}
          gap={"8px"}
          wrap='nowrap'
        >
          <Grid
            item
            xs
            justifyContent={"space-between"}
          >
            <Typography variant='h5'>
              Starting a new eInvoice?
            </Typography>
            <Button variant="contained" onClick={() => navigate("/user/create/form")}>
              Create
            </Button>
          </Grid>

          <Grid
            item
            xs
            justifyContent={"space-between"}
          >
            <Typography variant='h5'>
              Have a document to convert to an eInvoice?
            </Typography>
            <Button variant="contained">
              Convert
            </Button>
          </Grid>

          <Grid
            item
            xs
            justifyContent={"space-between"}
          >
            <Typography variant='h5'>
              Already prepared an eInvoice?
            </Typography>
            <Button variant="contained" onClick={() => navigate("/user/upload")}>
              Validate
            </Button>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}

export default function GetStartedButton({ invoices }: { invoices: EInvoiceItem[] }) {
  const [Popup, setPopup] = useState(false);

  const openPopup = () => {
    setPopup(true);
  }

  const numItems = invoices.length;

  return (
    <>
      {numItems < 5 ? (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{
            fontWeight: "bold",
            backgroundColor: "#28ed8e",
            '&:hover': {
              backgroundColor: "#44e397",
            }
          }}
          onClick={openPopup}
        >
          Get Started
        </Button>
      ) : (
        <Button
          type="submit"
          fullWidth
          variant="contained"
          endIcon={<LockIcon />}
          sx={{
            fontWeight: "bold",
            backgroundColor: "#cccccc",
            pointerEvents: "none", // Disable pointer events
          }}
        >
          Upgrade to Premium for more invoices
        </Button>
      )}

      {Popup && <GetStartedPopup Popup={Popup} setPopup={setPopup} />}
    </>
  );
}
