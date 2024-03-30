import axios from 'axios'
import { xmlData } from './common.js';


const RENDERING_ACCOUNT = {
  email: 'raywang2003@gmail.com',
  password: 'Password123'
}
const MAX_TRIES = 1
const TOKEN = '14059eab64562219290b12e1bf7b544ec44ba479e970e0d7b549cd7a40d96222' // DON'T CHANGE THIS!!

// sample pdf: https://billtime.io/storage/invoice_12345554_en.660356e9567c8.pdf

function getFormData(xmlData) {
  const formData = new FormData();
  const blob = new Blob([xmlData], {type: 'text/xml'})
  formData.append('file', blob, 'invoice.xml')
  formData.append('outputType', 'PDF')
  formData.append('language', 'en')
  formData.append('token', TOKEN)
  return formData
}

// sample response:
// {
//     PDFURL: https://billtime.io/storage/invoice_12345554_en.660356e9567c8.pdf,
//     UID: 2
// }
export async function callRenderingAPIPDF(xmlData) {
  let numTries = 0

  while (numTries < MAX_TRIES) {
    const formData = getFormData(xmlData)
    // console.log(formData);
    try {
      const res = await axios.post('http://rendering.ap-southeast-2.elasticbeanstalk.com/render', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return res.data;
    } catch (err) {
      console.log(err.response.data)
    }
    numTries++;
  }
}

// let res = callRenderingAPIPDF(xmlData).then(res => {
//   console.log(res)
// })
