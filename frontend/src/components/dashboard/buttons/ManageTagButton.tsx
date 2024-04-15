import { useContext, useState } from "react";
import { AuthContext } from "../../../context/AuthContextProvider";
import { EInvoiceItem } from "../../../data";
import {
  addInvoiceToUser,
  addTagsToInvoice,
  deleteTagsFromInvoice,
  sendInvoicesByNames,
} from "../../../service/service";
import ErrorPopup from "./ErrorPopup";
import {
  Box,
  Button, Checkbox, Container, Dialog, DialogTitle, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, TextField,
  Typography
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AddIcon from '@mui/icons-material/Add';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import HighlightOffTwoToneIcon from '@mui/icons-material/HighlightOffTwoTone';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';

function TagWithX({text}: {text: string}) {
  return (
    <Typography fontSize={15} sx={{
      marginRight: '0.5em',
      marginBottom: '0.5em',
      borderRadius: '5px',
      padding: '0.5em',
      backgroundColor: 'grey',
      color: 'white',
      textWrap: 'nowrap',
      width: 'fit-content',
      position: 'relative',
      display: 'flex',
      alignItems:'center'
    }}>
    {text}
    <RemoveCircleIcon fontSize="small"
      sx={{
        '&:hover': {
          color: "#ffbdbd",
          cursor: 'pointer'
        },
        marginLeft: '0.5em'
      }}
    />
    </Typography>
  )
}

function Tag({text}: {text: string}) {
  return (
    <Typography fontSize={15} sx={{
      borderRadius: '5px',
      padding: '0.1em', 
      backgroundColor: 'grey',
      color: 'white',
      textWrap: 'nowrap',
      width: 'fit-content'
    }}>{text}</Typography>
  )
}


function ManageInvoicePopup({ invoices, setInvoices, index, setPopup }: { invoices: EInvoiceItem[], setInvoices: Function, index:number, Popup: boolean, setPopup: Function }) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [buttonText, setButtonText] = useState('SEND');

  const invoiceTags = invoices[index].tags
  console.log(invoices[index])
  const userTags = ['U1', 'U2', 'U3']

  const addTagToInvoice = (index: number, tagName: string) => {
    let invoice = invoices[index];
    let tagRet = addTagsToInvoice(user!.username, user!.password, invoice.name, [tagName])
    setInvoices(tagRet)
  }

  const removeTagFromInvoice = (index: number, tagName: string) => {
    let invoice = invoices[index];
    let tagRet = deleteTagsFromInvoice(user!.username, user!.password, invoice.name, [tagName])
    setInvoices(tagRet)
  }

  const closePopup = () => {
    setPopup(false);
  }

  return (
    <>
      <Dialog onClose={closePopup} open>
        <DialogTitle>Manage tags for {invoices[index].name}</DialogTitle>
        <Box sx={{padding: '1em'}}>
          <Box sx={{
            border: '1px solid black', 
            padding: '0.5em',
            borderRadius: '0.5em', 
            minHeight: '1em',
            display: 'flex',
            flexWrap: 'wrap',
            maxWidth: '500px',
            marginBottom: '1em'
          }}>
            {
              invoiceTags.length == 0 ?
                <Typography>No Tags</Typography>
              :
              invoiceTags.map(tag => <div key={tag}> <TagWithX text={tag}></TagWithX></div>)
            }
          </Box>

          <TextField
            label='Search for tags...'
            sx={{
              marginBottom: '1em'
            }}
          >
          </TextField>
          
          <Box sx={{overflowY: 'scroll', overflowX: 'hidden', height:'200px', border: '1px solid black', position: 'relative', borderRadius: '0.5em'}}>
            <List>
              {
                userTags.length == 0 ? 
                  <Typography>No recent tags</Typography>
                :
                userTags.map(userTag => 
                <ListItem disablePadding key={userTag}>
                  <ListItemButton>
                    <ListItemIcon sx={{minWidth: '40px'}}>
                      <AccessTimeIcon />
                    </ListItemIcon>
                    <ListItemText sx={{display: 'flex', alignItems: 'center'}}>
                      <Tag text={userTag}></Tag>
                    </ListItemText>
  
                    <ListItemIcon>
                      <IconButton edge="end" aria-label="comments">
                        <Typography sx={{marginRight:'1em'}}>Add</Typography>
                        <AddIcon></AddIcon>
                      </IconButton>
                    </ListItemIcon>
                  </ListItemButton>
                </ListItem>
                )
              }
              </List>


              <ListItemButton
                sx={{
                  backgroundColor: "#dfffd9",
                  '&:hover': {
                    backgroundColor: "#c7ffbd",
                  },
                  position: 'sticky',
                  width: '100%',
                  bottom: '0px'
                }}
              >
                <ListItemIcon sx={{minWidth: '40px'}}>
                  <AddCircleOutlineIcon />
                </ListItemIcon>
                <ListItemText sx={{display: 'flex', alignItems: 'center'}}>
                  <Tag text='TAG5'></Tag>
                </ListItemText>

                <ListItemIcon>
                  <IconButton edge="end" aria-label="comments">
                    <Typography sx={{marginRight:'1em'}}>Create and add new tag</Typography>
                    <AddIcon />
                  </IconButton>
                </ListItemIcon>

              </ListItemButton>

            

          </Box>
        </Box>

        

        
      </Dialog>
    </>
  )
}

export default function ManageTagButton({invoices, setInvoices, index}: {invoices: EInvoiceItem[], setInvoices: Function, index: number}) {
  const [Popup, setPopup] = useState(false);

  const openPopup = () => {
    setPopup(true)
  }

  return ( 
    <>
      <Button 
        variant="outlined" 
        onClick={openPopup}
      >
        Manage Tags:
      </Button>
      
      {Popup && <ManageInvoicePopup invoices={invoices} setInvoices={setInvoices} index={index} Popup={Popup} setPopup={setPopup} />}
    </>
  );
}