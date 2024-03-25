const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const bcrypt = require('bcryptjs')
const Account = require('./models/account');
const EInvoice = require('./models/einvoice')

// app
const app = express();
app.use(express.json())
app.use(cors())
app.use(express.static('dist'))
app.use(morgan())

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
  const accounts = await Account.find({
    username: username
  })

  if (accounts.length == 0) {
    return false;
  }

  const account = accounts[0]
  if (!verifyHash(password, account.passwordEncrypted)) {
    return null;
  }
  return account;
}


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

  // attributes:
  // _id
  // username
  // email
  // passwordEncrypted
  newAccount.save().then(account => {
    res.json(account)
  })
})

app.post('/api/login', async (req, res) => {
  const body = req.body;
  const username = body.username
  const password = body.password
  const account = loginUser(username, password);
  if (account) {
    return res.json(account);
  } else {
    return res.status(403).json({error: 'invalid username or password'})
  }
})

app.post('/api/validate', async(req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  if (!loginUser(username, password)) {
    return res.status(403).json({error: 'invalid username or password'})
  }
  // call our validation api here
  // return the result
})

// assumes that the invoice being added is already valid
app.post('/api/addInvoice', async(req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  if (!loginUser(username, password)) {
    return res.status(403).json({error: 'invalid username or password'})
  }
  const name = req.body.name
  const xmlData = req.body.data;
  const newInvoice = new EInvoice({
    belongsTo: username,
    name: name,
    data: xmlData
  })
  newInvoice.save().then(invoice => res.json(invoice))
})

// user must be logged in to use this route
app.get('/api/getInvoicesBelongingTo', async(req, res) => {
  const username = req.params.username;
  const password = req.params.password;
  if (!loginUser(username, password)) {
    return res.status(403).json({error: 'invalid username or password'})
  }

  const invoices = EInvoice.find({
    belongsTo: username
  })
  res.json(invoices)
})