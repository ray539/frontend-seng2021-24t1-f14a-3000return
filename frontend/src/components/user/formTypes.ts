
const empty = {
  BuyerReference: '',
  InvoiceID: '', // internal id to be used by your company
  IssueDate: '',
  DueDate: '',
  // fix currencycode at AUD

  // ACCOUNTING SUPPLIER PARTY
  AccountingSupplierPartyPartyName: '',
  AccountingSupplierPartyStreetName: '',
  AccountingSupplierPartyAdditionalStreetName: '',
  AccountingSupplierPartyCityName: '',
  AccountingSupplierPartyPostalZone: '',
  AccountingSupplierPartyCountry: '', // AU or NZ
  AccountingSupplierPartyRegistrationName: '',
  AccountingSupplierPartyCompanyID: '9429040298443', // if AU, then it is ABN if NZ, it is NZBN

  // ACCOUNTING CUSTOMER PARTY
  AccountingCustomerPartyPartyName: 'buyer name',
  AccountingCustomerPartyStreetName: '1',
  AccountingCustomerPartyAdditionalStreetName: '1',
  AccountingCustomerPartyCityName: '1',
  AccountingCustomerPartyPostalZone: '2033',
  AccountingCustomerPartyCountry: 'AU', // AU or NZ
  AccountingCustomerPartyRegistrationName: 'buyer official name',
  AccountingCustomerPartyCompanyID: '47555222000', // if AU, then it is ABN if NZ, it is NZBN
  InvoiceLines: [
    {
      ID: 1,
      UnitCode: 'KGM', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '299.94',
      InvoicedQuantity: '10',
      ItemName: 'item type 1',
    },
    {
      ID: 1,
      UnitCode: 'KGM', // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
      UnitPrice: '111.11',
      InvoicedQuantity: '10',
      ItemName: 'item type 2',
    }
  ],
  GSTPercent: 10,
}