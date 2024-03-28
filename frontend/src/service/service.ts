import axios from 'axios'
import { EInvoiceItem, UserProfile } from '../data';

export async function logInAndGetUser(username: string, password: string) {
  try {
    const res = await axios.get('/api/login', {
      headers: {
        username: username,
        password: password
      }
    })
    const acct = res.data

    const retUser: UserProfile = {
      id: acct._id,
      username: acct.username,
      email: acct.email,
      password: password
    }

    return retUser
    
  } catch (err) {
    return null;
  }
}

export async function getInvoicesBelongingTo(username: string, password: string) {
  const res = await axios.get('/api/getInvoiceNamesBelongingTo', {
    headers: {
      username: username,
      password: password
    }
  })
  const einvoicesRaw = res.data as any[];
  const einvoices: EInvoiceItem[] = einvoicesRaw.map(invoice => {
    return {
      id: invoice._id,
      name: invoice.name
    }
  })
  return einvoices

}

export async function registerUser(username: string, email: string, password: string) {

  try {
    const res = await axios.post('/api/newAccount', {
      username: username,
      email: email,
      password: password,
    })
    const acct = res.data
  
    const retUser: UserProfile = {
      id: acct._id,
      username: acct.username,
      password: password,
      email: acct.email
    }
    return retUser
  } catch (err) {
    return null;
  }

}