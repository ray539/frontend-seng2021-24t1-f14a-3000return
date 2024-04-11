

import React, { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { DashBoardHeader } from "./DashboardPage";
import { Box, Button, Container, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";


function BackButton() {
  const navigate = useNavigate();
  return (
    <Box sx={{
        background: 'black',
        color: 'white',
        padding: '0.5em',
        borderRadius: '1em',
        display: 'flex',
        userSelect: 'none',
        '&:hover': {
          cursor: 'pointer'
        }
      }}
      onClick={()=>navigate('/user')}  
    >
      <img src="/images/back-arrow.png" style={{width: '30px', marginRight: '0.5em'}}></img>
      <Typography sx={{display: 'inline'}}>Back</Typography>
    </Box>
  )
}

function DropDown({text, tc, bgc, element, showElement, setShowElement}: {text: string, tc: string, bgc: string, element: React.ReactNode, showElement: boolean, setShowElement: Function}) {
  // const [showElement, setShowElement] = useState(false)
  
  return (
    <>
        <Container sx={{
          width: '50%', 
          marginTop: '2em',
          marginBottom: '2em',
          display: 'flex', 
          justifyContent:'center', 
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


function ChangeEmailForm({setShowElement}: {setShowElement: Function}) {
  const [newEmail, setNewEmail] = useState('')
  const [confEmail, setConfEmail] = useState('')
  const [pass, setPass] = useState('')

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
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log('submited');
          
        }}>

        
        <Typography component={'h1'} sx={{width: 'fit-content', margin: 'auto', fontSize: '30px', fontWeight: '600'}}>Update email</Typography>
        
        <Box sx={{
          border:'1px solid black',
          width: 'fit-content',
          position: 'absolute',
          top:  '10px',
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
          label={'new email'}
          value={newEmail}
          onChange={(e) => {setNewEmail(e.target.value)}}
          size='small'
          required
          sx={{ mt: 2, mb: 2 }}
        >
        </TextField>

        <TextField
          fullWidth
          label={'confirm email'}
          value={confEmail}
          onChange={(e) => {setConfEmail(e.target.value)}}
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
          onChange={(e) => {setPass(e.target.value)}}
          size='small'
          required
          sx={{ mt: 2, mb: 2 }}
        >
        </TextField>

        <Container sx={{width:'fit-content', marginBottom:'1em'}}>
          <Button variant='contained' type='submit'>Confirm</Button>
        </Container>
        </form>
      </Container>

    </>
  )
}

function ChangePasswordForm({setShowElement}: {setShowElement: Function}) {
  const [oldPass, setOldPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confPass, setConfPass] = useState('')

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
        <form onSubmit={(e) => {
          e.preventDefault()
          console.log('submited');
        }}>

        
        <Typography component={'h1'} sx={{width: 'fit-content', margin: 'auto', fontSize: '30px', fontWeight: '600'}}>Update password</Typography>
        
        <Box sx={{
          border:'1px solid black',
          width: 'fit-content',
          position: 'absolute',
          top:  '10px',
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
          label={'old password'}
          value={oldPass}
          onChange={(e) => {setOldPass(e.target.value)}}
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
          onChange={(e) => {setNewPass(e.target.value)}}
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
          onChange={(e) => {setConfPass(e.target.value)}}
          size='small'
          required
          sx={{ mt: 2, mb: 2 }}
        >
        </TextField>

        <Container sx={{width:'fit-content', marginBottom:'1em'}}>
          <Button variant='contained' type='submit'>Confirm</Button>
        </Container>
        </form>
      </Container>
    </>
  )
}


function DeleteAccountForm({setShowElement}: {setShowElement: Function}) {
  const [username, setUsername] = useState('')
  const [pass, setPass] = useState('')

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

        
        <Typography component={'h1'} sx={{width: 'fit-content', margin: 'auto', fontSize: '20px', fontWeight: '600'}}>
          Are you sure you wish to delete your account?
        </Typography>
        <Typography component={'h1'} sx={{width: 'fit-content', margin: 'auto', fontSize: '15px', textAlign: 'center'}}>
          This action is permanent and cannot be undone. To confirm, login once again.
        </Typography>
    
        <TextField
          fullWidth
          label={'username'}
          value={username}
          onChange={(e) => {setUsername(e.target.value)}}
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
          onChange={(e) => {setPass(e.target.value)}}
          size='small'
          required
          sx={{ mt: 2, mb: 2 }}
        >
        </TextField>

        <Container sx={{display: 'flex', justifyContent: 'center'}}>
          <Button variant='contained' type='submit' color='error' sx={{margin: '1em'}}>Delete</Button>

          <Button variant='contained' sx={{margin: '1em'}} onClick={() => setShowElement(false)}>Cancel</Button>
        </Container>
        </form>
      </Container>

    </>
  )
}

export default function ProfileManagementPage() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser

  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [showChangePass, setShowChangePass] = useState(false)
  const [showDeleteAcc, setShowDeleteAcc] = useState(false)

  return (
    <>
      <DashBoardHeader />
      <Box sx={{
        display: 'flex',
        margin: '1em',
        justifyContent: 'space-between'
      }}>
        <BackButton></BackButton>
      </Box>

      <Container sx={{border:'1px solid #dddddd', backgroundColor: '#fcfcfc', marginTop: '1em', paddingTop: '1em'}} maxWidth='sm'>
        <Box sx={{ width: 'fit-content',  margin: 'auto', display: 'flex', alignItems: 'center'}}>
          <img src="/images/empty-profile.png" style={{width: '50px', marginRight: '0.5em'}}></img>
        <Typography fontSize={20}>{user?.username}</Typography>
        </Box>
       
        <DropDown setShowElement={setShowChangeEmail} showElement={showChangeEmail} text={"Update Email"} tc={"white"} bgc={"black"} element={<ChangeEmailForm setShowElement={setShowChangeEmail}/>} ></DropDown>

        <DropDown setShowElement={setShowChangePass} showElement={showChangePass} text={"Change password"} tc={"white"} bgc={"black"} element={<ChangePasswordForm setShowElement={setShowChangePass}/>} ></DropDown>

        {/* <Box sx={{border: '1px solid black', width: '50%',  margin: 'auto', display: 'flex', justifyContent:'center'}}>
          <Typography>Delete account</Typography>
        </Box> */}
        <DropDown setShowElement={setShowDeleteAcc} showElement={showDeleteAcc} text={"Delete account"} tc='white' bgc='red' element={<DeleteAccountForm setShowElement={setShowDeleteAcc}/>} />

      </Container>

        
    </>
  )
}