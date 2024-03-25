require('dotenv').config()

const mongoose = require('mongoose')
const uri = process.env.MONGODB_URI
mongoose.set("strictQuery", false);
mongoose.connect(uri)
  .then(() => {console.log('connected');})

const Schema = mongoose.Schema

const EInvoiceSchema = new Schema({
  belongsTo: String, // username of account it belongs to
  name: String,
  data: String
})

// AccountSchema.set('toJSON', {
//   transform: (document, retObj) => {
//     retObj.id = retObj._id
//     delete retObj._id;
//     delete retObj._class
//   }
// })

const EInvoiceModel = mongoose.model("EInvoice", EInvoiceSchema)
module.exports = EInvoiceModel