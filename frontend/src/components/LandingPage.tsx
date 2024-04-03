import { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { AppBar, Toolbar, Typography, Button, Container, Grid, Paper, Divider } from "@mui/material";

export default function LandingPage() {
  const authContext = useContext(AuthContext);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            3000Return e-invoice application
          </Typography>
          {authContext.currentUser == null ? (
            <>
              <Button component={Link} to="/login" color="inherit">Sign In </Button>
              <Button component={Link} to="/register" color="inherit">Sign Up</Button>
            </>
          ) : (
            <>
              <Typography variant="body1">You are already logged in</Typography>
              <Button component={Link} to='/user' color="inherit">Go to dashboard</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container sx={{ mt: 3 }}>
        <Typography variant="h2" align="center" gutterBottom>Smart Invoicing Made Simple</Typography>
        <Divider />
        <Typography variant="h6" sx={{ marginBottom: 2, marginTop: 5 }}>Why choose us?</Typography>
        <Grid container spacing={4} justifyContent="center" sx={{ display: 'flex', alignItems: 'stretch' }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '50%' }}><Typography>Hassle free e-invoicing</Typography></Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '50%' }}><Typography>Multiple invoice creation types</Typography></Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '50%' }}><Typography>Secure and fast invoice validation</Typography></Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center', height: '50%' }}><Typography>Extra features coming soon!</Typography></Paper>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ mt: 10 }}>
        <Typography variant="h4" align="center" sx={{ mb: 5 }}>Our Competitive Pricing Plans</Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h5">Starter</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>Free</Typography>
              <Typography>- Invoice Validation <br /></Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h5">Standard</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>$5/month</Typography>
              <Typography>
                - Invoice Validation <br />
                - Invoice Rendering and Sending <br />
                - Quick Fix Suggestions on Invalid Reports <br />
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Paper variant="outlined" sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h5">Premium</Typography>
              <Typography variant="h6" sx={{ mt: 1 }}>$10/month</Typography>
              <Typography>
                - Invoice Validation <br />
                - Invoice Rendering and Sending <br />
                - Quick Fix Suggestions on Invalid Reports <br />
                - Unlimited Invoice Storage
                - Bulk Validation
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
