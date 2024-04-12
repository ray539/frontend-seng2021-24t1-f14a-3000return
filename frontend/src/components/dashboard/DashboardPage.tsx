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
  Button, Typography, Grid, Link,
  Paper
} from '@mui/material';
import ProfileManagementPage from './ProfileManagementPage'
// import { Container } from "react-bootstrap";

export function DashBoardHeader() {
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  return (
    <>
      <Grid 
        item
        height={"100vh"}
        sx={{
          backgroundColor: "#7B54E8"
        }}
      >
        <Grid
          container
          justifyContent={"space-between"} 
          height={"5%"}
          padding={1}
          paddingLeft={4}
          paddingRight={4}
        >
          <Typography 
            variant="h5" 
            alignContent={"center"} 
            sx={{ 
              flexGrow: 1 
            }}
          >
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
            <Button 
              variant="contained"
              href="/" 
              role="button"
              sx={{
                backgroundColor: "#060C2A",
                borderRadius: "100px"
              }}
              onClick={() => {
                authContext.setCurrentUser(null);
                navigate("/");
              }}
            >
              Sign Out
            </Button>
          )}
        </Grid>

        <Grid 
          container 
          justifyContent={"space-between"} 
          wrap="nowrap"
          height={"95%"}
          padding={"20px"}
          gap={"20px"}
        >

          <Paper 
            elevation={0} 
            sx={{ 
              padding: "20px"
            }}
          >
            <ProfileBox />
          </Paper>
          <Paper 
            elevation={0} 
            sx={{ 
              width: "100%", 
              padding: "20px"
            }}
          >
            <InvoicesBox />
          </Paper>
        </Grid>
      </Grid>
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
          <Route path="/profile" element={<ProfileManagementPage />} />
          <Route
            path="/view-invoice/:invoiceName"
            element={<InvoiceView />}
          ></Route>
        </Routes>
      )}
    </>
  );
}
