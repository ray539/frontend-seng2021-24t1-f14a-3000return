import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { Typography, Button, Grid, Fade, Box } from "@mui/material";
import { PrettyBox } from "./PrettyBox";
import logo from '../assets/blacklogo.png'
import brothers from '../assets/invoice-brothers.png'
// import lockin from '../assets/lock-in.png'

export default function LandingPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      <Grid
        container
        direction={"column"}
        bgcolor={"#7B54E8"}
        height={"fit-content"}
        justifyContent={"center"}
        alignItems={"flex-start"}
        padding={"20px"}
        paddingTop={"0px"}
        gap={4}
      >
        <Grid
          container
          justifyContent={"space-between"} 
          alignItems={"center"}
          height={"8%"}
          wrap="nowrap"
        > 
          <Grid container wrap="nowrap" alignItems={"center"} width={"50%"} gap={1}>
            <img src={logo} alt="Logo" width={"60px"}/>
            <Typography 
              variant="h5" 
              fontWeight={"bold"}
            >
              3000% Returns
            </Typography>
          </Grid>
          {authContext.currentUser == null ? (
            <>
              <Grid container gap={2} justifyContent={"flex-end"}>
                <Button 
                  component={Link} 
                  to="/login" 
                  variant="contained"
                  sx={{
                    backgroundColor: "#060C2A",
                    borderRadius: "100px"
                  }}
                >
                  Sign In 
                </Button>
                <Button 
                  component={Link} 
                  to="/register" 
                  variant="contained"
                  sx={{
                    backgroundColor: "#060C2A",
                    borderRadius: "100px"
                  }}
                >
                  Sign Up
                </Button>
              </Grid>
            </>
          ) : (
            <>
              <Button 
                component={Link} 
                to='/user' 
                variant="contained"
                sx={{
                  backgroundColor: "#060C2A",
                  borderRadius: "100px"
                }}
              >
                Dashboard
              </Button>
            </>
          )}
        </Grid>
        
        <Grid
          container
          justifyContent={"space-between"}
          direction={"row"}
          color={"white"}
          wrap="nowrap"
          paddingLeft={"100px"}
          paddingRight={"160px"}
        >
          <Fade in={true}>
            <Grid
              container
              direction={"column"}
              width={"45%"}
              justifyContent={"center"}
              gap={2}
            >
              <Typography variant="h2" fontWeight={"bold"}>eInvoicing made simple</Typography>
              <Typography variant="subtitle1">
                Say goodbye to paper invoices and embrace the digital age. <br />
                Revolutionize your billing process by effortlessly with creating, sending, and tracking eInvoices. <br />
                Make invoicing hassle-free and eco-friendly with e-invoicing today!
              </Typography>
              <Button 
                component={Link} 
                to="/register" 
                variant="contained"
                sx={{
                  height: "40px",
                  marginTop: "20px",
                  borderRadius: "100px",
                  fontWeight: "bold",
                  backgroundColor: "#28ed8e",
                  '&:hover': {
                    backgroundColor: "#44e397",
                  }
                }}
              >
                Get started
              </Button>
            </Grid>
          </Fade>
          
          <PrettyBox 
            width="auto" 
            colour="#060C2A" 
            element={
              <>
                <img src={brothers} alt="eInvoicing brothers" height={"100%"} />
              </>
            }
          />
        </Grid>
        
        <Box height={"10vh"}></Box>

        

        

      </Grid>

      <Grid
        container
        direction={"column"}
        height={"fit-content"}
        // alignItems={"flex-start"}
        bgcolor={"#060C2A"}
        padding={"5vw"}
        paddingTop={"3vw"}
        gap={4}
      >
        {/* <Grid container width={"auto"}>
          <PrettyBox 
            width="50%" 
            colour="#060C2A" 
            element={
              <>
                <img src={lockin} alt="cat saying lock in" height={"100%"} />
              </>
            }
          />
        </Grid> */}

        <Typography variant="h3" fontWeight={"bold"} color={"white"}>Our Subsciption Plans</Typography>
        <Grid container width={"auto"}>
          <PrettyBox
            width={"100%"}
            colour="#7B54E8"
            element={
              <>
                <Grid
                  container
                  direction={"row"}
                  wrap="nowrap"
                  justifyContent={"space-between"}
                  width={"100%"}
                >
                  <Grid
                    container
                    direction={"column"}
                    width={"70%"}
                  >
                    <Typography variant="h5">Free</Typography>
                    <Typography>
                      - Invoice creation <br />
                      - Invoice validation <br />
                      - Store up to five invoices
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"30%"}
                  >
                    <Typography variant="h3">Free</Typography>
                  </Grid>
                </Grid>
              </>
            }
          />
        </Grid>

        <Grid container width={"auto"}>
          <PrettyBox
            width={"100%"}
            colour="#7B54E8"
            element={
              <>
                <Grid
                  container
                  direction={"row"}
                  wrap="nowrap"
                  width={"100%"}
                  marginBottom={"-20px"}
                >
                  <Grid
                    container
                    direction={"column"}
                    width={"70%"}
                  >
                    <Typography variant="h5">Premium</Typography>
                    <Typography>
                      - Access to the same features as the free plan <br />
                      - Invoice rendering <br />
                      - Invoice sending <br />
                      - Unlimited storage
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    direction={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"30%"}
                  >
                    <Typography variant="h3">$15</Typography>
                    <Typography variant="h5">per month</Typography>
                  </Grid>
                </Grid>
              </>
            }
          />
        </Grid>

        <Grid container width={"auto"}>
          <PrettyBox
            width={"100%"}
            colour="#7B54E8"
            element={
              <>
                <Grid
                  container
                  direction={"row"}
                  wrap="nowrap"
                  width={"100%"}
                  marginBottom={"-20px"}
                >
                  <Grid
                    container
                    direction={"column"}
                    width={"70%"}
                  >
                    <Typography variant="h5">Team</Typography>
                    <Typography>
                      - Work in teams of at at least 5 users <br />
                      - Each user receives a premium account <br />
                      - Users in a team gain access to new features, allowing collaborative work
                    </Typography>
                  </Grid>
                  <Grid
                    container
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"30%"}
                  >
                    <Typography variant="h4">Coming soon</Typography>
                  </Grid>
                </Grid>
              </>
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
