import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import {
  Typography, Grid, Link, Box
} from '@mui/material';
import { Container } from "react-bootstrap";

export default function ProfileBox() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser

  return (
    <>
      <Grid item xs={3}>
        <Typography variant="h3">Welcome, {user?.username}!</Typography>
        {/* NO USER MANAGEMENT PAGE */}
        <br />
        <Link href="/user/profile" variant="body2">
          Manage account →
        </Link>
      </Grid>
      <br />
      <Container>
        <Typography variant="h6">
          Current plan: {user?.accountType} <br />
        </Typography>
        <Typography variant="h6">
          Your team:
        </Typography>
        <Box bgcolor={"#F1E8FF"} minHeight={250} display="flex" justifyContent="center" alignItems="center">
          <Typography variant="body2">
            You are currently not in a team
          </Typography>
        </Box>
      </Container>
    </>
  )
}