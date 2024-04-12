/* eslint-disable @typescript-eslint/ban-types */
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import InvoicesBox from "./InvoicesBox";
import ProfileBox from "./ProfileBox";
import ValidatePage from "./get_started/ValidatePage";
import CreationPage from "../redundant/CreationPage";
import { AuthContext } from "../../context/AuthContextProvider";
import {
  getXmlData,
} from "../../service/service";
import {
  Button, Typography, Grid, AppBar, Toolbar, Link,
  Paper
} from '@mui/material';
import ProfileManagementPage from './ProfileManagementPage'
// import { Container } from "react-bootstrap";

export function DashBoardHeader() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
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
    </>
  )
}


function Dashboard() {
  // const navigate = useNavigate();
  // const authContext = useContext(AuthContext);

  return (
    <>
      <DashBoardHeader />
      <Grid container spacing={0} marginLeft={0} marginRight={0} justifyContent={"space-between"} marginTop={5} wrap="nowrap">
        <Paper elevation={1} sx={{ paddingLeft: 3, paddingTop: 2, paddingBottom: 1, paddingRight: 3, height: "100%", marginTop: -3 }}>
          <ProfileBox />
        </Paper>
        <Paper elevation={1} color="black" sx={{ paddingLeft: 3, paddingTop: 2, paddingBottom: 1, height: "100%", width: "96%", paddingRight: 7, marginTop: -3 }}>
          <InvoicesBox />
        </Paper>
      </Grid >
    </>
  );
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
          <Route path="/upload" element={<ValidatePage />} />
          <Route path="/create/*" element={<CreationPage />} />
          <Route path="/profile" element={<ProfileManagementPage/>}></Route>
          <Route
            path="/view-invoice/:invoiceName"
            element={<InvoiceView />}
          ></Route>
        </Routes>
      )}
    </>
  );
}
