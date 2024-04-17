import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { Typography, Button, Grid, Paper } from "@mui/material";
import logo from '../assets/blacklogo.png'

export default function LandingPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      <Grid
        container
        bgcolor={"#7B54E8"}
        minHeight={"100vh"}
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
          direction={"row"}
          color={"white"}
          wrap="nowrap"
        >
          <Grid
            item
            width={"45%"}
          >
            <Typography variant="h2" fontWeight={"bold"}>eInvoicing made simple</Typography>
            <Typography variant="subtitle1">
              Say goodbye to paper invoices and embrace the digital age. <br />
              Revolutionize your billing process by effortlessly creating, sending, and tracking eInvoices. <br />
              Make invoicing hassle-free and eco-friendly with e-invoicing today!
            </Typography>
          </Grid>
          <Grid
            container
            width={"55%"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button 
              component={Link} 
              to="/register" 
              variant="contained"
              sx={{
                height: "40px",
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
          
          
        </Grid>
        

        <Paper
          elevation={10} 
          square
          sx={{ 
            width: "100%",
          }}
        >
          <Grid
            container
            bgcolor={"white"}
            padding={2}
            justifyContent={"center"}
          >
            <Typography variant="h4">Our Plans</Typography>
            <Grid container spacing={4} justifyContent="center">
              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5">Free</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>Free</Typography>
                  <Typography>
                    - Invoice creation <br />
                    - Invoice validation <br />
                    - Store up to five invoices
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5">Premium</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>$15/month</Typography>
                  <Typography>
                    - Access to the same features as the free plan <br />
                    - Invoice rendering <br />
                    - Invoice sending <br />
                    - Unlimited storage
                  </Typography>
                </Paper>
              </Grid>

              <Grid item xs={12} sm={4}>
                <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
                  <Typography variant="h5">Team</Typography>
                  <Typography variant="h6" sx={{ mt: 1 }}>Contact us</Typography>
                  <Typography>
                    - Coming soon!
                  </Typography>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Grid>
    </>
  );
}
