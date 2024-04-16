import {
  Dialog, DialogTitle
} from '@mui/material';

export default function ErrorPopup({ setPopup } : { Popup: boolean, setPopup: Function }) {
  const closeError = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closeError} open>
        <DialogTitle>Please select a file</DialogTitle>
      </Dialog>
    </>
  )
}