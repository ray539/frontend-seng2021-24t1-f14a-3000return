import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { Container, TextField, Button, Alert, Typography, Link, Grid } from '@mui/material';
import { registerUser } from "../service/service";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }
    const user = await registerUser(username, email, password)
    if (user == null) {
      setShowError(true);
      return;
    }

    authContext.setCurrentUser(user);
    navigate("/user");
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 3 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom>Sign up</Typography>
      <form onSubmit={handleSubmit} onFocus={() => setShowError(false)}>
        <TextField
          required
          fullWidth
          margin="normal"
          label="Username"
          variant="outlined"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          label="Email"
          variant="outlined"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          label="Password"
          variant="outlined"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          required
          fullWidth
          margin="normal"
          label="Confirm Password"
          variant="outlined"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {showError && <Alert severity="error">Passwords do not match or user already exists</Alert>}
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Sign up
        </Button>
        <Grid container justifyContent="space-between" alignItems={"center"}>
          <Grid item>
            <Button variant="contained" color="primary" href="/" role="button">
              Back
            </Button>
          </Grid>
          <Grid item>
            <Link href="/login" variant="body2">
              Already have an account? Sign In
            </Link>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
}
