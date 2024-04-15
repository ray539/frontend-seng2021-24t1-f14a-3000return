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
          padding={"10px"}
          wrap='nowrap'
        >
          <Grid
            container
            direction={"column"}
            xs
            justifyContent={"space-between"}
            alignItems={"center"}
            padding={"20px"}
            gap={"10px"}
          >
            <Typography variant='h5' fontWeight={"bold"}>
              Starting a new eInvoice?
            </Typography>
            <Typography variant='subtitle1'>
              Fill out a form to create a new eInvoice.
            </Typography>
            <Button 
              variant="contained"
              sx={{
                backgroundColor: "#7B54E8",
                '&:hover': {
                  backgroundColor: "#6a47cd",
                }
              }}
              onClick={() => navigate("/user/create/form")}>
              Create
            </Button>  
          </Grid>

          <Grid
            container
            direction={"column"}
            xs
            justifyContent={"space-between"}
            alignItems={"center"}
            borderLeft={"2px solid #7B54E8"}
            borderRight={"2px solid #7B54E8"}
            padding={"20px"}
            gap={"10px"}
          >
            <Typography variant='h5' fontWeight={"bold"}>
              Have a file to convert to an eInvoice?
            </Typography>
            <Typography variant='subtitle1'>
              Coming soon!
            </Typography>
            <Button 
              variant="contained" 
              sx={{
                backgroundColor: "#7B54E8",
                '&:hover': {
                  backgroundColor: "#6a47cd",
                }
              }}
              disabled
            >
              Convert
            </Button>
          </Grid>
          
          <Grid
            container
            direction={"column"}
            xs
            justifyContent={"space-between"}
            alignItems={"center"}
            padding={"20px"}
            gap={"10px"}
          >
            <Typography variant='h5' fontWeight={"bold"}>
              Already have an eInvoice prepared?
            </Typography>
            <Typography variant='subtitle1'>
              Validate your eInvoice to submit it.
            </Typography>
            <Button 
              variant="contained" 
              sx={{
                backgroundColor: "#7B54E8",
                '&:hover': {
                  backgroundColor: "#6a47cd",
                }
              }}
              onClick={() => navigate("/user/upload")}>
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