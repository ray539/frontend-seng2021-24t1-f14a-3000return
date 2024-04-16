

import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { Alert, Box, Button, Container, FormControl, Grid, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { changeEmail, changePassword, deleteAccount, logInAndGetUser, updateAccountType } from "../../service/service";
import logo from '../../assets/blacklogo.png'
import AccountCircleIcon from '@mui/icons-material/AccountCircle';


function DropDown({ text, tc, bgc, element, showElement, setShowElement }: { text: string, tc: string, bgc: string, element: React.ReactNode, showElement: boolean, setShowElement: Function }) {
  // const [showElement, setShowElement] = useState(false)

  return (
    <>
      <Container sx={{
        width: '50%',
        marginTop: '2em',
        marginBottom: '2em',
        display: 'flex',
        justifyContent: 'center',
        userSelect: 'none',
        backgroundColor: bgc,
        color: tc,
        padding: '0.5em',
        borderRadius: '1em',
        '&:hover': {
          cursor: 'pointer'
        }
      }}
        onClick={() => {
          setShowElement(!showElement)
        }}
      >
        <Typography>{text}</Typography>
      </Container>

      {showElement && element}

    </>
  )
}


function ChangeEmailForm({ setShowElement }: { setShowElement: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  const [newEmail, setNewEmail] = useState('')
  const [confEmail, setConfEmail] = useState('')
  const [pass, setPass] = useState('')

  const [showSuccess, setShowSuccess] = useState(false)

  useEffect(() => {
    return () => {
      setShowSuccess(false)
    }
  }, [])

  return (
    <>
      <Container sx={{
        border: '1px solid #dddddd',
        borderRadius: '1em',
        maxWidth: '75%',
        marginTop: '1em',
        marginBottom: '1em',
        position: 'relative'
      }}>
        <form onSubmit={async (e) => {
          e.preventDefault()
          if (newEmail != confEmail) {
            window.alert('emails do not match')
            return;
          }
          let a = await logInAndGetUser(user!.username, pass)
          if (a == null) {
            window.alert('incorrect password')
            return
          }

          let account = await changeEmail(user!.username, user!.password, newEmail)
          if (!account) {
            window.alert('an unknown error occured')
            return
          }
          console.log(account)
          authContext.setCurrentUser(account)
          setShowSuccess(true)
        }}
          onFocus={() => setShowSuccess(false)}
        >


          <Typography component={'h1'} sx={{ width: 'fit-content', margin: 'auto', fontSize: '30px', fontWeight: '600' }}>Update email</Typography>

          <Box sx={{
            border: '1px solid black',
            width: 'fit-content',
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '0 0.5em 0 0.5em',
            borderRadius: '0.5em',
            color: 'white',
            backgroundColor: 'black',
            userSelect: 'none',
            '&:hover': {
              cursor: 'pointer'
            }
          }}
            onClick={() => { setShowElement(false) }}
          >
            <Typography>back</Typography>
          </Box>

          <TextField
            fullWidth
            label={'new email'}
            value={newEmail}
            onChange={(e) => { setNewEmail(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'confirm email'}
            value={confEmail}
            onChange={(e) => { setConfEmail(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'password'}
            type='password'
            value={pass}
            onChange={(e) => { setPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          {
            showSuccess &&
            <Alert severity="success" sx={{ marginBottom: '1em' }}>
              Email successfully changed.
            </Alert>
          }


          <Container sx={{ width: 'fit-content', marginBottom: '1em' }}>
            <Button variant='contained' type='submit'>Confirm</Button>
          </Container>
        </form>
      </Container>

    </>
  )
}

function ChangePasswordForm({ setShowElement }: { setShowElement: Function }) {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confPass, setConfPass] = useState('')
  const [showSuccess, setShowSuccess] = useState(false)

  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  return (
    <>
      <Container sx={{
        border: '1px solid #dddddd',
        borderRadius: '1em',
        maxWidth: '75%',
        marginTop: '1em',
        marginBottom: '1em',
        position: 'relative'
      }}>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (newPass != confPass) {
              window.alert('passwords don\'t match')
              return;
            }
            let a = await logInAndGetUser(user!.username, oldPass)
            if (a == null) {
              window.alert('incorrect password')
              return
            }

            let account = await changePassword(user!.username, oldPass, newPass)
            if (!account) {
              window.alert('an unknown error occured')
              return
            }

            authContext.setCurrentUser(account)
            setShowSuccess(true)
          }}
          onFocus={() => setShowSuccess(false)}

        >


          <Typography component={'h1'} sx={{ width: 'fit-content', margin: 'auto', fontSize: '30px', fontWeight: '600' }}>Change password</Typography>

          <Box sx={{
            border: '1px solid black',
            width: 'fit-content',
            position: 'absolute',
            top: '10px',
            left: '10px',
            padding: '0 0.5em 0 0.5em',
            borderRadius: '0.5em',
            color: 'white',
            backgroundColor: 'black',
            userSelect: 'none',
            '&:hover': {
              cursor: 'pointer'
            }
          }}
            onClick={() => setShowElement(false)}
          >
            <Typography>back</Typography>
          </Box>

          <TextField
            fullWidth
            type='password'
            label={'old password'}
            value={oldPass}
            onChange={(e) => { setOldPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'new password'}
            type='password'
            value={newPass}
            onChange={(e) => { setNewPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'confirm new password'}
            type='password'
            value={confPass}
            onChange={(e) => { setConfPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <Container sx={{ width: 'fit-content', marginBottom: '1em' }}>
            <Button variant='contained' type='submit'>Confirm</Button>
          </Container>
          {
            showSuccess &&
            <Alert severity="success" sx={{ marginBottom: '1em' }}>
              Password successfully changed.
            </Alert>
          }
        </form>
      </Container>
    </>
  )
}

function ChangeAccountTypeForm({ setShowElement }: { setShowElement: Function }) {
  const [showSuccess, setShowSuccess] = useState(false)
  const [accountType, setAccountType] = useState<string>(''); // State to hold the selected account type
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

  // Initialize accountType with the user's current account type
  useEffect(() => {
    if (user) {
      setAccountType(user.accountType);
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updatedUser = await updateAccountType(user!.username, user!.password, accountType);
      authContext.setCurrentUser(updatedUser);
      setShowElement(false);
      setShowSuccess(true)
    } catch (error) {
      console.error('Error updating account type:', error);
    }
  };

  return (
    <>
      <Container
        sx={{
          border: '1px solid #dddddd',
          borderRadius: '1em',
          maxWidth: '75%',
          marginTop: '1em',
          marginBottom: '1em',
          position: 'relative'
        }}
      >
        <form onSubmit={handleSubmit}>
          <Typography component={'h1'} sx={{ width: 'fit-content', margin: 'auto', fontSize: '30px', fontWeight: '600' }}>Change plan</Typography>
          <Box
            sx={{
              border: '1px solid black',
              width: 'fit-content',
              position: 'absolute',
              top: '10px',
              left: '10px',
              padding: '0 0.5em 0 0.5em',
              borderRadius: '0.5em',
              color: 'white',
              backgroundColor: 'black',
              userSelect: 'none',
              '&:hover': {
                cursor: 'pointer'
              }
            }}
            onClick={() => setShowElement(false)}
          >
            <Typography>back</Typography>
          </Box>

          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <TextField
              select
              margin="normal"
              id="account-select"
              value={accountType}
              onChange={(e) => setAccountType(e.target.value)}
              fullWidth
              label="plan"
              required
            >
              <MenuItem value={"Free"}>Free</MenuItem>
              <MenuItem value={"Premium"}>Premium</MenuItem>
              <MenuItem value={"Team"}>Team</MenuItem>
            </TextField>
          </FormControl>

          <Container sx={{ width: 'fit-content', marginBottom: '1em' }}>
            <Button variant='contained' type='submit'>Confirm</Button>
          </Container>
          {
            showSuccess &&
            <Alert severity="success" sx={{ marginBottom: '1em' }}>
              Plan successfully changed.
            </Alert>
          }
        </form>
      </Container>
    </>
  );
}


function DeleteAccountForm({ setShowElement }: { setShowElement: Function }) {
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const navigate = useNavigate()

  return (
    <>
      <Container sx={{
        border: '1px solid #dddddd',
        borderRadius: '1em',
        maxWidth: '100%',
        marginTop: '1em',
        marginBottom: '1em',
        position: 'relative',
        paddingTop: '2em'
      }}>
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log('submited');

        }}>


          <Typography component={'h1'} sx={{ width: 'fit-content', margin: 'auto', fontSize: '20px', fontWeight: '600' }}>
            Are you sure you wish to delete your account?
          </Typography>
          <Typography component={'h1'} sx={{ width: 'fit-content', margin: 'auto', fontSize: '15px', textAlign: 'center' }}>
            This action is permanent and cannot be undone. To confirm, login once again.
          </Typography>

          <TextField
            fullWidth
            label={'username'}
            value={username}
            onChange={(e) => { setUsername(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <TextField
            fullWidth
            label={'password'}
            type='password'
            value={pass}
            onChange={(e) => { setPass(e.target.value) }}
            size='small'
            required
            sx={{ mt: 2, mb: 2 }}
          >
          </TextField>

          <Container sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button variant='contained' type='submit' color='error' sx={{ margin: '1em' }} onClick={async () => {
              if (username != user!.username || pass != user!.password) {
                window.alert('incorrect login')
                return
              }
              let a = await logInAndGetUser(username, pass)
              if (a == null) {
                window.alert('incorrect login');
                return;
              }
              let ret = await deleteAccount(username, pass)
              if (ret == null) {
                window.alert('error deleting account');
                return;
              }
              authContext.setCurrentUser(null)
              navigate('/thankyou')


            }}>Delete</Button>
            <Button variant='contained' sx={{ margin: '1em' }} onClick={() => setShowElement(false)}>Cancel</Button>
          </Container>
        </form>
      </Container>

    </>
  )
}

export default function ProfileManagementPage() {
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();
  // const user = authContext.currentUser

  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangePass, setShowChangePass] = useState(false)
  const [showDeleteAcc, setShowDeleteAcc] = useState(false)
  const [showChangeAccountType, setShowChangeAccountType] = useState(false);

  return (
    <>
      <Box
        bgcolor={"#7B54E8"}
        minHeight={"100vh"}
        height={"fit-content"}
      >
        <Grid
          container
          justifyContent={"space-between"} 
          alignItems={"center"}
          height={"8%"}
          paddingLeft={"20px"}
          paddingRight={"20px"}
          wrap="nowrap"
        > 
          <Grid container wrap="nowrap" alignItems={"center"} width={"50%"} gap={1}>
            <img src={logo} alt="Logo" width={"60px"}/>
            <Typography 
              variant="h5" 
              fontWeight={"bold"}
            >
              Dashboard
            </Typography>
          </Grid>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#060C2A",
              borderRadius: "100px"
            }}
            onClick={() => {
              navigate("/user");
            }}
          >
            Dashboard
          </Button>

        </Grid>

        <Grid
          container
          justifyContent={"space-between"}
          wrap="nowrap"
          height={"92%"}
          padding={"20px"}
          paddingTop={"0"}
          gap={"20px"}
        >
          <Paper 
            elevation={10} 
            square
            sx={{ 
              padding: "20px",
              width: "100%",
              height: "fit-content"
            }}
          >
            
            <Grid 
              container
              alignItems={"center"}
              gap={1}
            >
              <AccountCircleIcon fontSize="large"/> 
              <Typography variant="h5">
                {authContext.currentUser?.username}
              </Typography>
            </Grid>

            <DropDown
              setShowElement={setShowChangeAccountType}
              showElement={showChangeAccountType}
              text={"Change Account Type"}
              tc={"white"}
              bgc={"black"}
              element={<ChangeAccountTypeForm setShowElement={setShowChangeAccountType} />}
            ></DropDown>

            <DropDown setShowElement={setShowChangeEmail} showElement={showChangeEmail} text={"Update Email"} tc={"white"} bgc={"black"} element={<ChangeEmailForm setShowElement={setShowChangeEmail} />} ></DropDown>

            <DropDown setShowElement={setShowChangePass} showElement={showChangePass} text={"Change password"} tc={"white"} bgc={"black"} element={<ChangePasswordForm setShowElement={setShowChangePass} />} ></DropDown>

            <DropDown setShowElement={setShowDeleteAcc} showElement={showDeleteAcc} text={"Delete account"} tc='white' bgc='red' element={<DeleteAccountForm setShowElement={setShowDeleteAcc} />} />
            
          </Paper>
        </Grid>
      </Box>
    </>
  )
}