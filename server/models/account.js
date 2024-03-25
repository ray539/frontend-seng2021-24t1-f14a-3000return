require('dotenv').config()

const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI
mongoose.set("strictQuery", false);
mongoose.connect(uri)
  .then(() => {console.log('connected');})

const Schema = mongoose.Schema

const AccountSchema = new Schema({
  username: String,
  email: String,
  passwordEncrypted: String
})

// AccountSchema.set('toJSON', {
//   transform: (document, retObj) => {
//     retObj.id = retObj._id
//     delete retObj._id;
//     delete retObj._class
//   }
// })

const AccountModel = mongoose.model("Account", AccountSchema)
module.exports = AccountModel
