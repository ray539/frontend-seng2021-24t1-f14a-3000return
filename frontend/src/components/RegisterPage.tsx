import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContextProvider";
import { TextField, Button, Alert, Typography, Link, Grid, MenuItem, Box, Container } from '@mui/material';
import { registerUser } from "../service/service";
import logo from '../assets/logo.png'
import { PrettyBox } from "./PrettyBox";

function TeamCreationForm({setTeamsPage}: {setTeamsPage: Function}) {
  return (
    <>
      <Typography variant="h4" fontWeight={"bold"}>Register Team</Typography>
      <Typography variant="subtitle1" color={"#7B54E8"}>Register all team members at once.</Typography>
      <Link onClick={() => setTeamsPage(false)} sx={{cursor: 'pointer'}} variant="body2"> Back</Link>
      <Grid item width={"40%"}>
        <form>
          <Grid 
            container
            direction={"column"}
            alignItems={"center"}  
            width={"100%"}
            gap={1}
          >
            <Typography>Team Details</Typography>
            <TextField
              required
              fullWidth
              label="Team username"
            />
            <TextField
              required
              fullWidth
              type='number'
              label="No. team members"
            />
            <Typography>Team owner details</Typography>
            <TextField
              required
              fullWidth
              label="Username"
            />
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
            />
            <TextField
              required
              fullWidth
              label="Password"
              type='password'
            />

            <TextField
              required
              fullWidth
              label="Confirm password"
              type='password'
            />

            <Button
              variant="contained"
              sx={{
                margin: 'auto',
                backgroundColor: "#060C2A",
                borderRadius: "100px",
                '&:hover': {
                  backgroundColor: "#7B54E8",
                },
                textWrap: 'nowrap'
              }}
              onClick={() => null}
            >
              create team
            </Button>
            <Typography>
              Team code
            </Typography>
            <Typography variant='caption' sx={{textAlign:'center'}}>
              Share this code with your teammates when they register their account.
            </Typography>
            <Container sx={{width: '100%', border: '1px solid black', display: 'flex', justifyContent: 'space-between'}}>
              <Typography>Promo code:</Typography>
              <Typography sx={{backgroundColor: 'lightgrey'}}>Qafiaias12ASdasd</Typography>
            </Container>
          </Grid>
        </form>
      </Grid>
    </>
  )
}

function AccountRegistrationForm({teamsPage, setTeamsPage}: {teamsPage: boolean, setTeamsPage: Function}) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showError, setShowError] = useState(false);
  const [plan, setPlan] = useState('');
  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }
    const user = await registerUser(username, email, password, plan)
    console.log(plan)
    if (user == null) {
      setShowError(true);
      return;
    }

    authContext.setCurrentUser(user);
    navigate("/user");
  };

  return (
    <>
      <Typography variant="h4" fontWeight={"bold"}>Register</Typography>
      <Typography variant="subtitle1" color={"#7B54E8"}>Create a new account</Typography>
      <Link href="/login" variant="body2">
          Already have an account? Sign in here
      </Link>
      <br />
      <Grid item width={"40%"}>
        <form onSubmit={handleSubmit} onFocus={() => setShowError(false)}>
          <Grid 
            container
            direction={"column"}
            alignItems={"center"}  
            width={"100%"}
             gap={1}
          >
            <TextField
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <TextField
              select
              id="account-select"
              value={plan}
              onChange={(e) => setPlan(e.target.value)}
              fullWidth
              label="Plan"
              required
            >
              <MenuItem value={"Free"}>Free</MenuItem>
              <MenuItem value={"Premium"}>Premium</MenuItem>
              <MenuItem value={"Team"}>Team</MenuItem>
            </TextField>

            {
              plan == 'Team' && 
              <>
                <Typography>Team Plan details</Typography>
                <TextField
                  id="team-invite-code"
                  fullWidth
                  label="Team invite code"
                  required
                >
                </TextField>
                
                <Container sx={{width: 'fit-content'}}>
                  <Typography sx={{display: 'inline', marginRight: '1em'}} >or</Typography>
                  <Button
                    variant="contained"
                    sx={{
                      margin: 'auto',
                      backgroundColor: "#060C2A",
                      borderRadius: "100px",
                      '&:hover': {
                        backgroundColor: "#7B54E8",
                      },
                      textWrap: 'nowrap'
                    }}
                    onClick={() => setTeamsPage(true)}
                  >create new team</Button>
                </Container>
              </>
            }



            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#060C2A",
                width: "60%",
                borderRadius: "100px",
                '&:hover': {
                  backgroundColor: "#7B54E8",
                }
              }}
            >
              Sign up
            </Button>
            {showError && <Alert severity="error">Passwords do not match or user already exists</Alert>}
          </Grid>
        </form>
      </Grid>
    </>
  )
}

export default function RegisterPage() {
  const navigate = useNavigate();

  const [teamsPage, setTeamsPage] = useState(false)
  
  const authContext = useContext(AuthContext);

  return (
    <>
      <Grid 
        container
        height={"100vh"}
        width={"100vw"}
      >
        <Grid 
          container
          direction={"column"}
          justifyContent={"space-between"}
          alignItems={"center"}
          width={"70%"}
          padding={2}
        >
          <Grid
            container
            alignItems={"center"}
            gap={2}
          >
            <img src={logo} alt="Logo" width={"80px"}/>
            <Typography 
              variant="h4" 
              fontWeight={"bold"}
            >
              3000% Returns
            </Typography>
          </Grid>

          <Grid
            container
            direction={"column"}
            alignItems={"center"}
            wrap="nowrap"
            height={"fit-content"}
          >
              {
                teamsPage ? 
                  <TeamCreationForm setTeamsPage={setTeamsPage} />
                  :
                  <AccountRegistrationForm teamsPage={teamsPage} setTeamsPage={setTeamsPage} />
              }
          </Grid>
          
          <Grid
            container
            justifyContent={"flex-end"}
          >
            <Button variant="text" color="primary" onClick={() => navigate("/")}>
              Return to homepage →
            </Button>
          </Grid>
        </Grid>
        
        <Grid 
          container
          direction={"column"}
          justifyContent={"flex-start"}
          alignItems={"center"}
          width={"30%"}
          padding={3}
          gap={2}
          bgcolor={"#7B54E8"}
          color={"white"}
        >
          <Typography 
            variant="h4" 
            fontSize={32} 
            fontWeight={"bold"}
          >
            Our plans
          </Typography>
          
          <PrettyBox 
            width="100%" 
            colour="#060C2A"
            element={
              <>
                <Typography variant="h5" fontWeight={"bold"}>Free</Typography>
                <Typography variant="subtitle1">
                  New to eInvoicing?<br />
                  Begin with our free plan.
                </Typography>
              </>
            }
          />
          
          <PrettyBox 
            width="100%" 
            colour="#060C2A"
            element={
              <>
                <Typography variant="h5" fontWeight={"bold"}>Premium</Typography>
                <Typography variant="subtitle1">
                  Want additional features?<br />
                  Select the premium plan
                </Typography>
              </>
            }
          />
          
          <PrettyBox 
            width="100%" 
            colour="#060C2A"
            element={
              <>
                <Typography variant="h5" fontWeight={"bold"}>Team</Typography>
                <Typography variant="subtitle1">
                  Coming soon!
                </Typography>
              </>
            }
          />
        </Grid>
      </Grid>
    </>
  );
}
