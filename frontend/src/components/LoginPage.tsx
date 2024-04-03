import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { Container, TextField, Button, Alert, Grid, Link, Typography } from "@mui/material";
import { useContext } from "react";
import { logInAndGetUser } from "../service/service";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    const user = await logInAndGetUser(username, password);

    if (user == null) {
      setShowError(true);
      return;
    }
    authContext.setCurrentUser(user);
    navigate("/user");
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 3 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>Sign in</Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              variant="outlined"
              required
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
        </Grid>
        {showError && <Alert severity="error">Incorrect username or password!</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Login
        </Button>
        <Grid container justifyContent="space-between" alignItems={"center"}>
          <Grid item>
            <Button variant="contained" color="primary" href="/" role="button">
              Back
            </Button>
          </Grid>
          <Grid item>
            <Link href="/register" variant="body2">
              Don't have an account? Sign Up
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
