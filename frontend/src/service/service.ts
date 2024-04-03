/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosError } from 'axios'
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
      name: invoice.name,
      checked: false,
      pdfGenMsg: 'generate pdf'
    }
  })
  return einvoices
}

export async function validateFile(username: string, password: string, xmlFile: File) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.readAsText(xmlFile)
    reader.onload = async (e) => {
      const xmlData = e.target?.result as string;
      const res = await axios.post('/api/validate', xmlData, {
        headers: {
          username: username,
          password: password,
          "Content-Type": 'application/xml'
        }
      })
      resolve(res.data)
    }
  })
}

export async function getPdfLink(username: string, password: string, xmlData: string) {
  try {
    const res = await axios.post('/api/render', xmlData, {
      headers: {
        username: username,
        password: password,
        "Content-Type": 'application/xml'
      }
    })
    console.log(res.data);
    return res.data.PDFURL
  } catch (err) {
    return null
  }
}

/**
 * give a list of invoiceNames and
 * get all invoices with name in invoiceNames
 * @param username 
 * @param password 
 * @param invoiceNames 
 * @returns 
 */
export async function getInvoicesByNames(username: string, password: string, invoiceNames: string[]) {
  try {
    const res = await axios.post('/api/getInvoicesByNames', { names: invoiceNames }, {
      headers: {
        username: username,
        password: password,
      }
    })
    return res.data;
  } catch (err) {
    return null
  }
}


/**
 * give a list of invoiceNames and emails
 * sends those invoices to those emails
 * @param username 
 * @param password 
 * @param invoiceNames 
 * @returns 
 */
export async function sendInvoicesByNames(username: string, password: string, invoiceNames: string[], emails: string[], from: string) {
  try {
    const res = await axios.post('/api/sendInvoicesByNames', {
      invoiceNames: invoiceNames,
      emails: emails,
      from: from
    }, {
      headers: {
        username: username,
        password: password,
      }
    })
    return res.data;
  } catch (err) {
    return { success: false }
  }
}

/**
 * get xml data of an invoice given it's name
 * @param username 
 * @param password 
 * @param filename 
 * @returns 
 */
export async function getXmlData(username: string, password: string, filename: string) {
  try {
    const res = await axios.get(`/api/getInvoiceDataByName?name=${filename}`, {
      headers: {
        username: username,
        password: password
      },
    })
    const xmlData = res.data
    return xmlData
  } catch (err) {
    console.log('here');

    return null;
  }
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

export async function addInvoiceToUser(username: string, password: string, xmlFile: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsText(xmlFile)
    reader.onload = async (e) => {
      const xmlData = e.target?.result as string;

      try {
        await axios.post('/api/addInvoice', xmlData, {
          params: {
            name: xmlFile.name
          },
          headers: {
            username: username,
            password: password,
            "Content-Type": 'application/xml'
          }
        })

        resolve('ok')
      } catch (err) {
        reject((err! as AxiosError).response!.data)
      }
    }
  })
}

export async function deleteInvoicesFromUser(username: string, password: string, invoiceNames: string[]) {
  try {
    const res = await axios({
      method: 'delete',
      url: '/api/deleteInvoices',
      data: { names: invoiceNames },
      headers: {
        username: username,
        password: password
      }
    })

    console.log(res);


    const numDel = res.data.numDeleted
    return numDel
  } catch (err) {
    return null;
  }
}