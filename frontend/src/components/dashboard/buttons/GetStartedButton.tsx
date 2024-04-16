// import { useState } from "react";
import {
  Box,
  Button, Dialog,
  Grid,
  Typography,
} from '@mui/material';
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import CreateIcon from '@mui/icons-material/Create';
import ChangeCircleIcon from '@mui/icons-material/ChangeCircle';
import TaskAltIcon from '@mui/icons-material/TaskAlt';


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
          paddingTop={"20px"}
          paddingBottom={"20px"}
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
                backgroundColor: "#060C2A",
                borderRadius: "100px",
                '&:hover': {
                  backgroundColor: "#7B54E8",
                }
              }}
              onClick={() => navigate("/user/create/form")}
            >
              <Grid 
                container 
                justifyContent={"space-between"} 
                alignItems={"center"}
                wrap="nowrap"
                width={"120px"}
              >
                <CreateIcon /> Create <Box></Box>
              </Grid>
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
                backgroundColor: "#060C2A",
                borderRadius: "100px",
                '&:hover': {
                  backgroundColor: "#7B54E8",
                }
              }}
              disabled
            >
              <Grid 
                container 
                justifyContent={"space-between"} 
                alignItems={"center"}
                wrap="nowrap"
                width={"120px"}
              >
                <ChangeCircleIcon /> Convert <Box></Box>
              </Grid>
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
                backgroundColor: "#060C2A",
                borderRadius: "100px",
                '&:hover': {
                  backgroundColor: "#7B54E8",
                }
              }}
              onClick={() => navigate("/user/upload")}
            >
              <Grid 
                container 
                justifyContent={"space-between"} 
                alignItems={"center"}
                wrap="nowrap"
                width={"120px"}
              >
                <TaskAltIcon /> Validate <Box></Box>
              </Grid>
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
				Start eInvoicing
			</Button>

      {Popup && <GetStartedPopup Popup={Popup} setPopup={setPopup} />}
    </>
  );
}