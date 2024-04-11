import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import {
  Button,
  Typography,
  Container,
  CircularProgress,
  AppBar,
  Toolbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { addInvoiceToUser, validateFile } from "../../../service/service";
import { AuthContext } from "../../../context/AuthContextProvider";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

type ValidationOutcome = "" | "loading" | "successful" | "unsuccessful";
type StoreOutcome = "" | "loading" | "stored" | "error";

export default function ValidatePage() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const [file, setFile] = useState<File | null>(null);
  const [warning, setWarning] = useState(false);
  const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>("");
  const [storeOutcome, setStoreOutcome] = useState<StoreOutcome>("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const [validationReason, setValidationReason] = useState("");
  const [validationDetails, setValidationDetails] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValidationOutcome("");
    setStoreOutcome("");
    setWarning(false);

    if (e.target.files && e.target.files.length > 0) {
      const toUpload = e.target.files[0];
      if (!(toUpload.type === "text/xml")) {
        setFile(null);
        setWarning(true);
        return;
      }
      setFile(toUpload);
    } else {
      setFile(null);
    }
  };

  const handleFileSubmit = async () => {
    setValidationOutcome("loading");
    const reportJSON = await validateFile(user!.username, user!.password, file!) as any;
    if (reportJSON.successful) {
      setValidationOutcome("successful");
      setOpenDialog(true);
      setDialogMessage("Validation Successful");
    } else {
      setValidationOutcome("unsuccessful");
      setOpenDialog(true);
      setDialogMessage("Validation Failed");
      if (reportJSON.reason === "Both UBL assertion errors and PEPPOL assertion errors were fired") {
        let tableContent = "<table style='border-collapse: collapse;'><thead><tr><th style='border: 1px solid black;'><Typography>ID</Typography></th><th style='border: 1px solid black;'><Typography>Test</Typography></th><th style='border: 1px solid black;'><Typography>Description</Typography></th><th style='border: 1px solid black;'><Typography>Severity</Typography></th></tr></thead><tbody>";
        for (const assertionError of reportJSON.firedAssertionErrors.aunz_PEPPOL_1_1_10) {
          tableContent += `<tr><td style='border: 1px solid black;'><Typography>${assertionError.id}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.test}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.description}</Typography></td><td style='border: 1px solid black; color: ${assertionError.severity === 'fatal' ? 'red' : assertionError.severity === 'warning' ? 'orange' : 'inherit'}'><Typography>${assertionError.severity}</Typography></td></tr>`;
        }
        for (const assertionError of reportJSON.firedAssertionErrors.aunz_UBL_1_1_10) {
          tableContent += `<tr><td style='border: 1px solid black;'><Typography>${assertionError.id}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.test}</Typography></td><td style='border: 1px solid black;'><Typography>${assertionError.description}</Typography></td><td style='border: 1px solid black; color: ${assertionError.severity === 'fatal' ? 'red' : assertionError.severity === 'warning' ? 'orange' : 'inherit'}'><Typography>${assertionError.severity}</Typography></td></tr>`;
        }
        tableContent += "</tbody></table>";
        setValidationReason(reportJSON.reason);
        setValidationDetails(tableContent.trim());
      } else {
        setValidationReason(reportJSON.reason);
        setValidationDetails(`<Typography>${reportJSON.details}</Typography>`);
      }
    }
  };

  const handleFileStore = async () => {
    try {
      setStoreOutcome("loading");
      await addInvoiceToUser(user!.username, user!.password, file!)
      setStoreOutcome("stored");
    } catch (err) {
      setStoreOutcome("error");
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            3000Return e-invoice application
          </Typography>
          <Button color="inherit" component={Link} to="/user/get-started">
            Back
          </Button>
        </Toolbar>
      </AppBar>
      <Container>
        <br />
        <br />
        <Typography variant="h2">Upload your invoice</Typography>
        <br />
        <br />
        <br />
        <div>
          <Button
            component="label"
            role={undefined}
            variant="contained"
            startIcon={<CloudUploadIcon />}
          >
            Upload file
            <input type="file" onChange={handleFileChange} hidden />
          </Button>
        </div>
        <br />
        {warning && <Typography variant="body1">Error: the file must be XML</Typography>}
        {file && (
          <div>
            <Typography variant="body1">File details:</Typography>
            <ul>
              <li>Name: {file.name} </li>
              <li>Size: {file.size} bytes</li>
            </ul>
          </div>
        )}
        {file ? (
          <Typography variant="body1">
            Click submit. We will run some validation checks before allowing you to store it to our database
          </Typography>
        ) : (
          <Typography variant="body1">Choose a file to upload</Typography>
        )}
        {validationOutcome && validationOutcome !== "loading" && (
          <Typography variant="body1">Validation Outcome: {validationOutcome}</Typography>
        )}
        <Button disabled={!file || validationOutcome === "loading"} onClick={handleFileSubmit}>
          Submit
        </Button>
        <Button disabled={!file || validationOutcome !== "successful"} onClick={handleFileStore}>
          Store
        </Button>
        {storeOutcome && (
          <Typography variant="body1">
            Storage Outcome: {storeOutcome === "loading" ? <CircularProgress size={20} /> : storeOutcome}
          </Typography>
        )}
        <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
          <DialogTitle>{dialogMessage}</DialogTitle>
          <DialogContent>
            {validationOutcome === "successful" ? (
              <>
                <Typography variant="body1">
                  Your file has been successfully validated.
                </Typography>
                <Button disabled={!file || validationOutcome !== "successful"} onClick={() => { handleCloseDialog(); handleFileStore(); }}>
                  Store
                </Button>
              </>
            ) : (
              <>
                <Typography variant="body1">
                  {validationReason}
                </Typography>
                <Typography variant="body1" dangerouslySetInnerHTML={{ __html: validationDetails }} />
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </>
  );
}
