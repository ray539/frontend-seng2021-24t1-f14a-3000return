import { EInvoiceItem } from "../../../data";

/**
 * given a e-invoice with a list of tags and selection string,
 * return whether the tags matches the selectionString
 * @param invoice 
 * @param selectionString 
 */
export function evaluateString(invoice: EInvoiceItem, selectionString: string) {
  const tags = invoice.tags;
  // selectionString = (A,B,C|D,E,F,G)|(H,I)
  // console.log(tags)
  const tokens = selectionString.split(/\s*/)
  let evalStr = ''
  for (const token of tokens) {
    if (token == '(') {
      evalStr += '( ';
    } else if (token == ')') {
      evalStr += ') '
    } else if (token == ',') {
      evalStr += '&& '
    } else if (token == '|') {
      evalStr += '|| '
    } else if (/^[a-zA-Z0-9_-]+$/.test(token)) {
      if (tags.includes(token)) {
        evalStr += 'true '
      } else {
        evalStr += 'false '
      }
    }
  }
  console.log(evalStr)

  try {
    const res = eval(evalStr)
    return res.toString()
  } catch(err) {
    return 'invalid'
  }
  

}