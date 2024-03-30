import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import bcrypt from 'bcryptjs'
import Account from './models/account.js'
import EInvoice from './models/einvoice.js'
import { callValidationAPIJSON } from './external-apis/validation.js'
import { callRenderingAPIPDF } from './external-apis/rendering.js'
import 'express-async-errors'

// app
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan())
app.use(express.text({type: 'application/xml'}))


// bcrypt
const salt = bcrypt.genSaltSync(10);

function hashPassword(password) {
  return bcrypt.hashSync(password, salt)
}

function verifyHash(password, hash) {
  return bcrypt.compareSync(password, hash)
}

const PORT = process.env.PORT || 3002
app.listen(PORT, () => {
  console.log('app listening on port', PORT);
})

/**
 * return the account on success / null on faliure
 * @param {string} username 
 * @param {string} password 
 * @returns 
 */
async function loginUser(username, password) {
  console.log('loginUser');
  const accounts = await Account.find({
    username: username
  })

  if (accounts.length == 0) {
    console.log('failed login');
    return null;
  }

  const account = accounts[0]
  if (!verifyHash(password, account.passwordEncrypted)) {
    console.log('failed login');
    return null;
  }
  return account;
}
// return object:
//   _id
//   username
//   email
//   passwordEncrypted
app.post('/api/newAccount', async (req, res) => {
  const body = req.body;
  const usernameNew = body.username
  const passwordNew = body.password
  const emailNew = body.email

  const existing = await Account.find({
    username: usernameNew
  })

  if (existing.length > 0) {
    return res.status(403).json({error: 'account with username ' + usernameNew + ' already exists'})
  }

  const newAccount = new Account({
    username: usernameNew,
    email: emailNew,
    passwordEncrypted: hashPassword(passwordNew),
  })


  newAccount.save().then(account => {
    res.json(account)
  })
})

// returnObject:
//    _id
//    username
//    email
//    passwordEncrypted
app.get('/api/login', async (req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password);
  if (account) {
    return res.json(account);
  } else {
    return res.status(403).json({error: 'invalid username or password'})
  }
})

app.post('/api/validate', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  console.log(username, password)

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }

  const xmlData = req.body
  const data = await callValidationAPIJSON(xmlData)
  return res.json(data)
})

// //
// // each item has
// //   -username
// //   -ourLink
// //   -billTimeUrl
// const tempLinks = []


// // update this
// let linkGen = 0;
// function generateLink() {
//   linkGen++;
//   return linkGen.toString()
// }

// header
//    username
//    password
// body
//    xmldata
// returns
// sample response:
// {
//     PDFURL: https://billtime.io/storage/invoice_12345554_en.660356e9567c8.pdf,
//     UID: 2
// }
app.post('/api/render', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  console.log(username, password)

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }

  const xmlData = req.body
  const data = await callRenderingAPIPDF(xmlData)
  console.log('here');
  console.log(data);

  // const billTimeUrl = data.PDFURL
  // const ourLink = generateLink();
  // tempLinks.push({
  //   username: username,
  //   ourLink: ourLink,
  //   billTimeUrl: billTimeUrl
  // })

  return res.json(data)
})

// app.get('/storage/pdf', async(req, res) => {
//   const username = req.headers.username;
//   const password = req.headers.password;
//   const link = req.query.tempPdfLink

//   const account = await loginUser(username, password)
//   if (!account) {
//     return res.status(403).json({error: 'invalid username or password'})
//   }

//   // get link they requested
//   const tempLinkData = tempLinks.find(l => l.ourLink == link);
//   if (!tempLinkData) {
//     return res.status(404).send('<div>404 PAGE NOT FOUND </div>')
//   }

//   // check that usernames match up
//   if (tempLinkData.username != username) {
//     return res.status(404).send('<div>404 PAGE NOT FOUND </div>')
//   }

//   const htmlContent = `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//         <meta charset="UTF-8">
//         <meta name="viewport" content="width=device-width, initial-scale=1.0">
//         <title>Sample HTML Page</title>
//     </head>
//     <style>
//       iframe {
//         width: 100%;
//         height: 100%;
//         border: none;
//       }
//     </style>
//     <body>
//         <iframe src="${tempLinkData.billTimeUrl}"></iframe>
//     </body>
//     </html>
//   `;
//   // res.send(htmlContent)
//   res.send(tempLinkData.billTimeUrl)



  


// })

/**
 * checks that invName is unique
 * assume that belongsTo points to a correct username
 * @param {*} belongsTo 
 * @param {*} invName 
 * @returns 
 */
async function checkName(belongsTo, invName) {
  const foundInvoices = await EInvoice.find(
    {
      belongsTo: belongsTo,
      name: invName
    }
  )
  if (foundInvoices.length > 0) {
    return false;
  }
  return true;
}
// assumes that the invoice being added is already valididated
// headers:
//   username
//   password
// query
//   name
// body
//   <xml data>
// 
// an invoice must have an "name" field
// for a certain user, the all invoices must be unique
app.post('/api/addInvoice', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }
  const name = req.query.name
  if (!name) {
    return res.status(400).json({error: 'must include name field in params'})
  }

  const isUniqueName = await checkName(username, name);
  console.log(username, name);
  console.log(isUniqueName)
  if (!isUniqueName) {
    return res.status(400).json({error: 'name must be unique'})
  }

  const xmlData = req.body;
  const newInvoice = new EInvoice({
    belongsTo: username,
    name: name,
    data: xmlData
  })

  let invoice = newInvoice.save();
  res.json(invoice)
})

// user must be logged in to use this route
// headers:
//   username
//   password
app.get('/api/getInvoicesBelongingTo', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }

  const invoices = await EInvoice.find({
    belongsTo: username
  })

  // console.log(invoices[0].data)
  // console.log(invoices);

  res.json(invoices)
})


// delete invoice given a name
// headers:
//   username
//   password
// query:
//   name
app.delete('/api/deleteInvoice', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const name = req.query.name;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }

  const deleted = EInvoice.deleteOne(
    {name: name}
  )
  res.json(deleted)
})

// delete a bunch of invoices from the database
// headers:
//   username
//   password
// body:
//   names: array[string]
app.delete('/api/deleteInvoices', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const names = req.body.names;

  console.log(username, password);

  console.log(names);

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }

  try {
    const result = await EInvoice.deleteMany(
      {
        name: {$in: names}
      }
    )
    res.json({numDeleted: result.deletedCount})
  } catch (err) {
    res.status(400).status(err.message)
  }
})


// get names of invoices belonging to certain person
// headers:
//   username
//   password
app.get('/api/getInvoiceNamesBelongingTo', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }
  const invoiceNames = await EInvoice.find({
    belongsTo: username
  }).select('name')

  res.json(invoiceNames)

})

// get data of certain invoice
// headers:
//   username
//   password
// query:
//   invoiceName
app.get('/api/getInvoiceDataByName', async(req, res) => {
  const username = req.headers.username;
  const password = req.headers.password;
  const invoiceName = req.query.name;

  const account = await loginUser(username, password)
  if (!account) {
    return res.status(403).json({error: 'invalid username or password'})
  }

  const invoices = await EInvoice.find({
    belongsTo: username,
    name: invoiceName
  })

  if (invoices.length == 0) {
    return res.status(403).json({error: 'your invoice couldn\'t be found'})
  }

  res.json(invoices[0].data)
})

// get invoice data