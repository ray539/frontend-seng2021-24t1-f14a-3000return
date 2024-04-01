import { useEffect, useState } from "react";
import {
  Button,
  Container,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

type InvoiceItem = {
  ID: string;
  UnitCode: string; // https://docs.peppol.eu/poacc/billing/3.0/codelist/UNECERec20/
  UnitPrice: string;
  InvoicedQuantity: string;
  ItemName: string;
};

type CreationFormData = {
  BuyerReference?: string;
  InvoiceID?: string; // internal id to be used by your company
  IssueDate?: string;
  DueDate?: string;
  // fix currencycode at AUD

  // ACCOUNTING SUPPLIER PARTY
  AccountingSupplierPartyPartyName?: string;
  AccountingSupplierPartyStreetName?: string;
  AccountingSupplierPartyAdditionalStreetName?: string;
  AccountingSupplierPartyCityName?: string;
  AccountingSupplierPartyPostalZone?: string;
  AccountingSupplierPartyCountry?: "AU" | "NZ"; // AU or NZ
  AccountingSupplierPartyRegistrationName?: string;
  AccountingSupplierPartyCompanyID?: string; // if AU, then it is ABN (11 digits) if NZ, it is NZBN (13 digits)

  // ACCOUNTING CUSTOMER PARTY
  AccountingCustomerPartyPartyName?: string;
  AccountingCustomerPartyStreetName?: string;
  AccountingCustomerPartyAdditionalStreetName?: string;
  AccountingCustomerPartyCityName?: string;
  AccountingCustomerPartyPostalZone?: string;
  AccountingCustomerPartyCountry?: "AU" | "NZ"; // AU or NZ
  AccountingCustomerPartyRegistrationName?: string;
  AccountingCustomerPartyCompanyID?: string; // if AU, then it is ABN (11 digits) if NZ, it is NZBN (13 digits)
  InvoiceLines: InvoiceItem[];
};

function StringField({
  label,
  attrName,
  placeholder,
  tooltipText,
  formData,
  setFormData,
}: {
  label: string;
  attrName: string;
  placeholder: string;
  tooltipText: string;
  formData: CreationFormData;
  setFormData: Function;
}) {
  const value = (formData as any)[attrName] ? (formData as any)[attrName] : "";
  return (
    <Form.Group className="mb-3" controlId="formBasicUsername">
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip>{tooltipText}</Tooltip>}
      >
        <Form.Label>
          {" "}
          <b>{label}</b>
        </Form.Label>
      </OverlayTrigger>

      <Form.Control
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          let newObj = { ...formData } as any;
          newObj[attrName] = e.target.value;
          setFormData(newObj);
        }}
      />
    </Form.Group>
  );
}

function DateField({
  label,
  attrName,
  placeholder,
  tooltipText,
  formData,
  setFormData,
}: {
  label: string;
  attrName: string;
  placeholder: string;
  tooltipText: string;
  formData: CreationFormData;
  setFormData: Function;
}) {
  const value = (formData as any)[attrName] ? (formData as any)[attrName] : "";
  return (
    <Form.Group className="mb-3" controlId="formBasicUsername">
      <OverlayTrigger
        placement="right"
        overlay={<Tooltip>{tooltipText}</Tooltip>}
      >
        <Form.Label>
          {" "}
          <b>{label}</b>
        </Form.Label>
      </OverlayTrigger>

      <Form.Control
        type="date"
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          // console.log(typeof e.target.value);

          let newObj = { ...formData } as any;
          newObj[attrName] = e.target.value;
          setFormData(newObj);
        }}
      />
    </Form.Group>
  );
}

const newItem = {
  ID: "",
  UnitCode: "",
  UnitPrice: "",
  InvoicedQuantity: "",
  ItemName: "",
};
export default function CreationForm() {
  const [formData, setFormData] = useState<CreationFormData>({
    AccountingSupplierPartyCountry: "AU",
    AccountingCustomerPartyCountry: "AU",
    InvoiceLines: [{ ...newItem }],
  });

  const [numItems, setNumItems] = useState(1);
  let itemInputs = [];
  for (let i = 0; i < numItems; i++) {
    const input = (
      <div key={i}>
        <h2>Item type {i + 1}</h2>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Used to uniqely identify item</Tooltip>}
          >
            <Form.Label>
              {" "}
              <b>ID</b>
            </Form.Label>
          </OverlayTrigger>

          <Form.Control
            type="text"
            placeholder="12345"
            value={formData.InvoiceLines[i].ID}
            onChange={(e) => {
              let newObj = { ...formData };
              newObj.InvoiceLines[i].ID = e.target.value;
              setFormData(newObj);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>eg. Brushes</Tooltip>}
          >
            <Form.Label>
              {" "}
              <b>Name</b>
            </Form.Label>
          </OverlayTrigger>

          <Form.Control
            type="text"
            placeholder="12345"
            value={formData.InvoiceLines[i].ItemName}
            onChange={(e) => {
              let newObj = { ...formData };
              newObj.InvoiceLines[i].ItemName = e.target.value;
              setFormData(newObj);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Measurement unit, eg. KGM (kilograms)</Tooltip>}
          >
            <Form.Label>
              {" "}
              <b>Unit code</b>
            </Form.Label>
          </OverlayTrigger>

          <Form.Control
            type="text"
            placeholder="KGM"
            value={formData.InvoiceLines[i].UnitCode}
            onChange={(e) => {
              let newObj = { ...formData };
              newObj.InvoiceLines[i].UnitCode = e.target.value;
              setFormData(newObj);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <OverlayTrigger
            placement="right"
            overlay={
              <Tooltip>
                Price of 1 unit of your item. Total price is calculated by the
                form. Round to 2dp
              </Tooltip>
            }
          >
            <Form.Label>
              {" "}
              <b>Unit price</b>
            </Form.Label>
          </OverlayTrigger>

          <Form.Control
            type="text"
            placeholder="10.00"
            value={formData.InvoiceLines[i].UnitPrice}
            onChange={(e) => {
              let newObj = { ...formData };
              newObj.InvoiceLines[i].UnitPrice = e.target.value;
              setFormData(newObj);
            }}
          />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicUsername">
          <OverlayTrigger
            placement="right"
            overlay={<Tooltip>Number of this type of item</Tooltip>}
          >
            <Form.Label>
              {" "}
              <b>Quantity</b>
            </Form.Label>
          </OverlayTrigger>

          <Form.Control
            type="text"
            placeholder="2"
            value={formData.InvoiceLines[i].InvoicedQuantity}
            onChange={(e) => {
              let newObj = { ...formData };
              newObj.InvoiceLines[i].InvoicedQuantity = e.target.value;
              setFormData(newObj);
            }}
          />
        </Form.Group>
      </div>
    );

    itemInputs.push(input);
  }

  return (
    <>
      <Container>
        <h1>Invoice Creation Form</h1>
        <p>Please fill out these details and download the xml generated</p>
        <Form>
          <h2>General details</h2>
          <StringField
            label="Buyer reference"
            attrName="BuyerReference"
            placeholder="ORDER123"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="Invoice ID"
            attrName="InvoiceID"
            placeholder="INV_01"
            tooltipText="uniquely identifies invoice internally"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <DateField
            label="Issue date"
            attrName="IssueDate"
            placeholder="22-02-2023"
            tooltipText="issue date"
            formData={formData}
            setFormData={setFormData}
          ></DateField>
          <DateField
            label="Due date"
            attrName="DueDate"
            placeholder="22-02-2023"
            tooltipText="due date"
            formData={formData}
            setFormData={setFormData}
          ></DateField>
          <h2>Seller's details</h2>
          <h3>Business details</h3>
          <StringField
            label="Business name"
            attrName="AccountingSupplierPartyPartyName"
            placeholder="unofficial business name"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="Registration name"
            attrName="AccountingSupplierPartyRegistrationName"
            placeholder="official business name"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          {/* ABN or NZBN, fix later*/}
          <StringField
            label="Company ID"
            attrName="AccountingSupplierPartyCompanyID"
            placeholder="47555222000"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>

          <h3>Address</h3>
          <StringField
            label="Street name 1"
            attrName="AccountingSupplierPartyStreetName"
            placeholder="1 low street"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="Street name 2"
            attrName="AccountingSupplierPartyAdditionalStreetName"
            placeholder="..."
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="City"
            attrName="AccountingSupplierPartyCityName"
            placeholder="Sydney"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="Postal code"
            attrName="AccountingSupplierPartyPostalZone"
            placeholder="2033"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Australia or New Zealand (for now)</Tooltip>}
            >
              <Form.Label>
                {" "}
                <b>Country</b>
              </Form.Label>
            </OverlayTrigger>

            <Form.Select
              aria-label="AU"
              onChange={(e) => {
                // const value = (formData as any)['AccountingSupplierPartyCountry'] ? (formData as any)['AccountingSupplierPartyCountry'] : ''
                let newObj = { ...formData } as any;
                newObj["AccountingSupplierPartyCountry"] = e.target.value;
                setFormData(newObj);
              }}
            >
              <option>AU</option>
              <option>NZ</option>
            </Form.Select>
          </Form.Group>

          <h2>Buyer's details</h2>
          <h3>Business details</h3>
          <StringField
            label="Business name"
            attrName="AccountingCustomerPartyPartyName"
            placeholder="unofficial business name"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="Registration name"
            attrName="AccountingCustomerPartyRegistrationName"
            placeholder="official business name"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          {/* ABN or NZBN, fix later*/}
          <StringField
            label="Company ID"
            attrName="AccountingCustomerPartyCompanyID"
            placeholder="47555222000"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>

          <h3>Address</h3>
          <StringField
            label="Street name 1"
            attrName="AccountingCustomerPartyStreetName"
            placeholder="1 low street"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="Street name 2"
            attrName="AccountingCustomerPartyAdditionalStreetName"
            placeholder="..."
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="City"
            attrName="AccountingCustomerPartyCityName"
            placeholder="Sydney"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>
          <StringField
            label="Postal code"
            attrName="AccountingCustomerPartyPostalZone"
            placeholder="2033"
            tooltipText="identifies buyer, eg. order nmber"
            formData={formData}
            setFormData={setFormData}
          ></StringField>

          <Form.Group className="mb-3" controlId="formBasicUsername">
            <OverlayTrigger
              placement="right"
              overlay={<Tooltip>Australia or New Zealand (for now)</Tooltip>}
            >
              <Form.Label>
                {" "}
                <b>Country</b>
              </Form.Label>
            </OverlayTrigger>

            <Form.Select
              aria-label="AU"
              onChange={(e) => {
                // const value = (formData as any)['AccountingSupplierPartyCountry'] ? (formData as any)['AccountingSupplierPartyCountry'] : ''
                let newObj = { ...formData } as any;
                newObj["AccountingCustomerPartyCountry"] = e.target.value;
                setFormData(newObj);
              }}
            >
              <option>AU</option>
              <option>NZ</option>
            </Form.Select>
          </Form.Group>

          <h1>Invoice lines</h1>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>
              {" "}
              <b>number of items</b>
            </Form.Label>

            <Form.Control
              type="number"
              value={numItems}
              onChange={(e) => {
                let newNumItems = Number(e.target.value);
                if (newNumItems < 1) return;
                setNumItems(Number(e.target.value));

                let newLines: InvoiceItem[] = [];
                for (let i = 0; i < newNumItems; i++) {
                  if (i >= formData.InvoiceLines.length) {
                    newLines.push({ ...newItem });
                  } else {
                    newLines.push(formData.InvoiceLines[i]);
                  }
                }

                setFormData({ ...formData, InvoiceLines: newLines });
              }}
            />
          </Form.Group>
          {itemInputs}

          <Button onClick={() => {
            
          }}>submit</Button>
        </Form>
        
      </Container>
    </>
  );
}
