import { Typography, Button, Grid, AppBar, Toolbar } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CreationPage() {
  const navigate = useNavigate();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h5" sx={{ flexGrow: 1 }}>
            3000Return e-invoice application
          </Typography>
          <Button color="inherit" onClick={() => navigate("/user/get-started")}>
            Back
          </Button>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} justifyContent={"center"} marginTop={3} marginBottom={15}>
        <Typography variant="h2">Creation page</Typography>
        <Grid container spacing={2} marginTop={5} alignItems={"center"} textAlign={"center"}>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Create from file (coming soon)</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography variant="subtitle1">Create from form</Typography> <br />
            <Button variant="contained" onClick={() => navigate("/user/create")}>
              GO
            </Button>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
}
