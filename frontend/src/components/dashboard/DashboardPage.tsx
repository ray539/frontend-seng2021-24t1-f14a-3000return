/* eslint-disable @typescript-eslint/ban-types */
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import GetStartedPage from "./get_started/GetStartedPage";
import ValidatePage from "./get_started/ValidatePage";
import CreationPage from "./get_started/CreationPage";
import SendPopUp from "./pop_ups/SendPopUp";
import { AuthContext } from "../../context/AuthContextProvider";
import { EInvoiceItem } from "../../data";
import {
  deleteInvoicesFromUser,
  getInvoicesBelongingTo,
  getPdfLink,
  getXmlData,
} from "../../service/service";
import {
  Button, Checkbox, FormControlLabel,
  Typography, Grid, AppBar, Toolbar, Paper, Link, Box
} from '@mui/material';
import { Container } from "react-bootstrap";

function Dashboard() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);
  const [showSendUI, setShowSendUI] = useState(false);

  const [deletedConfirmation, setDeleteConfirmation] = useState<{
    state: "hidden" | "shown" | "loading";
    numItems: number;
  }>({
    state: "hidden",
    numItems: 0,
  });

  useEffect(() => {
    console.log(user?.username, user?.password);
    getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
      setInvoices(invoices)
    );
  }, []);

  function changePdfButtonMsg(
    msg:
      | "generate pdf"
      | "fetching xml..."
      | "generating..."
      | "an error occured :(",
    i: number
  ) {
    const invoices_ = [...invoices];
    invoices_[i].pdfGenMsg = msg;
    setInvoices(invoices_);
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          {authContext.currentUser == null ? (
            <>
              <Button variant="contained" color="primary" href="/login" role="button">
                Sign In
              </Button>
              <Button variant="contained" color="primary" href="/register" role="button">
                Sign Up
              </Button>
            </>
          ) : (
            // DOESNT ACTUALLY LOG A USER OUT!!! FIX LATER!
            <Button color="inherit" href="/" role="button" onClick={() => {
              authContext.setCurrentUser(null);
              navigate("/");
            }}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <div style={{ marginBottom: 25 }}></div>
      <Grid container spacing={0} marginLeft={0} marginRight={0} justifyContent={"space-between"} marginTop={5}>
        <Paper elevation={0} sx={{ paddingLeft: 3, paddingTop: 2, paddingBottom: 1, paddingRight: 3, height: "100%", marginTop: -3 }}>
          <Grid item xs={3}>
            <Typography variant="h3">Welcome, {authContext.currentUser?.username}!</Typography>
            {/* NO USER MANAGEMENT PAGE */}
            <br />
            <Link href="/user-profile" variant="body2">
              Manage account
            </Link>➡️
          </Grid>
          <br />
          <Container>
            <Typography variant="h6">
              Current plan: Premium <br />
            </Typography>
            <Typography variant="h6">
              Your team:
            </Typography>
            <Box bgcolor={"#cde6f7"} minHeight={250} display="flex" justifyContent="center" alignItems="center">
              <Typography variant="body2">
                You are currently not in a team
              </Typography>
            </Box>
          </Container>
        </Paper >
        <Grid item xs={9}>
          <Paper elevation={0} color="black" sx={{ paddingLeft: 3, paddingTop: 2, paddingBottom: 1, height: "100%", width: "96%", paddingRight: 7, marginTop: -3 }}>
            <Typography variant="h4">Your Invoices</Typography>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              onClick={() => {
                navigate("/user/get-started");
              }}
            >
              Get Started
            </Button>
            <Grid container spacing={2}>
              <Grid item >
                <Button variant="contained">Download</Button>
              </Grid>
              <Grid item >
                <Button variant="contained" onClick={() => {
                  if (!invoices.find(i => i.checked)) {
                    return;
                  }
                  setShowSendUI(true);
                }}>Send</Button>
              </Grid>
              <Grid item  >
                <Button variant="contained" onClick={() => {
                  const numItems = invoices.filter((invoice) => invoice.checked).length;
                  if (numItems == 0) return;
                  setDeleteConfirmation({
                    state: "shown",
                    numItems: numItems,
                  });
                }}>Delete</Button>
              </Grid>
            </Grid>
            <Box sx={{ bgcolor: "#cde6f7", marginTop: 2, paddingTop: "10px", minHeight: "34.5%" }}>
              {invoices.length === 0 ? (
                <Typography>No Invoices!</Typography>
              ) : (
                invoices.map((invoice, i) => (
                  <Box key={invoice.id} display={"flex"} justifyContent={"space-between"}>
                    <Box>
                      <FormControlLabel
                        control={<Checkbox
                          checked={invoice.checked}
                          onChange={(e) => {
                            const invoices_ = [...invoices];
                            invoices_[i].checked = e.target.checked;
                            setInvoices(invoices_);
                          }}
                        />}
                        label={invoice.name} // Set the label of the checkbox to be the name of the invoice
                        labelPlacement="end" // Align the label to the start of the checkbox
                      />
                    </Box>
                    <Box>
                      <Button variant="outlined" onClick={() => {
                        window.open(`/user/view-invoice/${invoice.name}`);
                      }}>View XML</Button>
                      <Button variant="outlined" onClick={async () => {
                        changePdfButtonMsg("fetching xml...", i);
                        const xmlData = await getXmlData(
                          user!.username,
                          user!.password,
                          invoice.name
                        );
                        console.log(xmlData);
                        changePdfButtonMsg("generating...", i);
                        const link = await getPdfLink(
                          user!.username,
                          user!.password,
                          xmlData
                        );
                        if (!link) {
                          changePdfButtonMsg("an error occured :(", i);
                          setTimeout(() => changePdfButtonMsg("generate pdf", i), 1000);
                          return;
                        }
                        changePdfButtonMsg("generate pdf", i);
                        setTimeout(() => window.open(link), 100);
                      }}>{invoice.pdfGenMsg}</Button>
                    </Box>
                  </Box>
                ))
              )}
            </Box>



            {showSendUI && <SendPopUp invoices={invoices} showSendUI={showSendUI} setShowSendUI={setShowSendUI} />}

            {deletedConfirmation.state != "hidden" && (
              <div>
                {deletedConfirmation.state == "shown" ? (
                  <>
                    <Typography variant="h5">Delete Items</Typography>
                    <div>Delete these {deletedConfirmation.numItems} items?'</div>
                  </>

                ) : (
                  <div>Loading</div>
                )}
                <Button onClick={async () => {
                  const names = invoices
                    .filter((invoice) => invoice.checked)
                    .map((invoice) => invoice.name);
                  setDeleteConfirmation({
                    ...deletedConfirmation,
                    state: "loading",
                  });
                  await deleteInvoicesFromUser(
                    user!.username,
                    user!.password,
                    names
                  );

                  setInvoices(invoices.filter((invoice) => !invoice.checked));
                  setDeleteConfirmation({
                    ...deletedConfirmation,
                    state: "hidden",
                  });
                }}>Yes</Button>
                <Button onClick={() =>
                  setDeleteConfirmation({ ...deletedConfirmation, state: "hidden" })
                }>No</Button>
              </div>
            )}
          </Paper>
        </Grid>
      </Grid >
    </>);
}

export function NotLoggedIn() {
  return (
    <>
      <Typography variant="h1">You are not logged in</Typography>
      <Typography>You must log in to access features</Typography>
      <Link href="/">Back</Link>
    </>
  );
}

function InvoiceView() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const { invoiceName } = useParams();
  const [xmlData, setXmlData] = useState("Fetching...");

  useEffect(() => {
    console.log(invoiceName);
    if (!invoiceName) {
      setXmlData("Your invoice couldn't be loaded");
    }

    getXmlData(user!.username, user!.password, invoiceName!).then((data) => {
      if (data == null) {
        setXmlData("Your invoice couldn't be loaded");
        return;
      }
      setXmlData(data);
    });
  }, []);

  return (
    <>
      <Typography variant="h1">{invoiceName}</Typography>
      <Typography>{xmlData}</Typography>
    </>
  );
}

export default function DashboardPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      {authContext.currentUser == null ? (
        <NotLoggedIn />
      ) : (
        <Routes>
          <Route path="/" element={<Dashboard />}></Route>
          <Route path="/get-started" element={<GetStartedPage />}></Route>
          <Route path="/upload" element={<ValidatePage />} />
          <Route path="/create/*" element={<CreationPage />} />
          <Route
            path="/view-invoice/:invoiceName"
            element={<InvoiceView />}
          ></Route>
        </Routes>
      )}
    </>
  );
}
