// import { useState } from "react";
import {
  Button, Dialog,
} from '@mui/material';
import { useNavigate } from "react-router-dom";



function GetStartedPopup({ setPopup }: {  Popup: boolean, setPopup: Function }) {
  const closePopup = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
      </Dialog>
    </>
  )
}

export default function SendButton() {
	const navigate = useNavigate();
  // const [Popup, setPopup] = useState(false);

  // const openPopup = () => {
	// 	setPopup(true);
  // }

  return ( 
    <>
			<Button
				type="submit"
				fullWidth
				variant="contained"
				sx={{
					backgroundColor: "#33F497",
					'&:hover': {
						backgroundColor: "#44e397",
					}
				}}
				onClick={() => {
					navigate("/user/get-started");
				}}
			>
				Get Started
			</Button>

      {/* <Button variant="contained" onClick={openPopup}>
        Get Started
      </Button> */}
      
      {/* {Popup && <GetStartedPopup Popup={Popup} setPopup={setPopup} />} */}
    </>
  );
}