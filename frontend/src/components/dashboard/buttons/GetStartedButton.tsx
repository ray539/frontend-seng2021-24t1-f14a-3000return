// import { useState } from "react";
import {
  Button, Dialog,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";



function GetStartedPopup({ setPopup }: {  Popup: boolean, setPopup: Function }) {
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

export default function GetStartedButton() {
  const [Popup, setPopup] = useState(false);

  const openPopup = () => {
		setPopup(true);
  }

  return ( 
    <>
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
				// onClick={() => {
				// 	navigate("/user/get-started");
				// }}
        onClick={openPopup}
			>
				Get Started
			</Button>

      {Popup && <GetStartedPopup Popup={Popup} setPopup={setPopup} />}
    </>
  );
}