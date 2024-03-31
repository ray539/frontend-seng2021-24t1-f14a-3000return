/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { addInvoiceToUser, validateFile } from "../../service/service";
import { AuthContext } from "../../context/AuthContextProvider";

// type PageState = 'waiting-submit' | 'wait-validation' | 'post-validation'

function ValidationMsg({ validationOutcome }: { validationOutcome: ValidationOutcome }) {
  if (validationOutcome == '') {
    return <></>
  } else if (validationOutcome == 'loading') {
    return <div>LOADING...</div>
  } else if (validationOutcome == 'successful') {
    return <div>validation successful!</div>
  } else if (validationOutcome == 'unsuccessful') {
    return <div>validation failed</div>
  }
}

function StorageMsg({ outcome }: { outcome: StoreOutcome }) {
  if (outcome == '') {
    return <></>
  } else if (outcome == 'loading') {
    return <div>LOADING...</div>
  } else if (outcome == 'stored') {
    return <div>success! Your new invoice has been stored to our database</div>
  } else if (outcome == 'error') {
    return <div>there was an error storing your invoice. You most likely already have a invoice with that name</div>
  }
}

type ValidationOutcome = '' | 'loading' | 'successful' | 'unsuccessful'
type StoreOutcome = '' | 'loading' | 'stored' | 'error'

export default function UploadPage() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser

  const [file, setFile] = useState<File | null>(null);

  const [warning, setWarning] = useState(false);
  const [validationOutcome, setValidationOutcome] = useState<ValidationOutcome>('')
  const [storeOutcome, setStoreOutcome] = useState<StoreOutcome>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    // reset
    setValidationOutcome('')
    setStoreOutcome('')
    setWarning(false)

    if (e.target.files && e.target.files.length > 0) {
      const toUpload = e.target.files[0];
      if (!(toUpload.type == 'text/xml')) {
        setFile(null)
        setWarning(true);
        return;
      }
      setFile(toUpload)
      // setFile(e.target.files[0])
    } else {
      setFile(null)
    }
  }

  const handleFileSubmit = async () => {
    setValidationOutcome('loading')
    const reportJSON = await validateFile(user!.username, user!.password, file!) as any
    console.log(reportJSON);
    if (reportJSON.successful) {
      setValidationOutcome('successful')
    } else {
      setValidationOutcome('unsuccessful')
    }
  }

  const handleFileStore = async () => {
    try {
      setStoreOutcome('loading')
      await addInvoiceToUser(user!.username, user!.password, file!)
      setStoreOutcome('stored')
    } catch (err) {
      setStoreOutcome('error')
    }

  }

  return (
    <>
      <h1>upload your invoice</h1>
      <div>
        <input id="file" type='file' onChange={handleFileChange}></input>
      </div>
      {warning && <div>error: the file must be XML</div>}
      {
        file && (
          <div>
            File details:
            <ul>
              <li>Name: {file.name} </li>
              <li>Size: {file.size} bytes</li>
            </ul>
          </div>
        )
      }
      {
        file ? (
          <div>
            Click submit. We will run some validation checks before allowing you to store it to our database
          </div>
        ) : (
          <div>
            Choose a file to upload
          </div>
        )
      }

      <ValidationMsg validationOutcome={validationOutcome}></ValidationMsg>

      <button disabled={file == null} onClick={handleFileSubmit}>Submit</button>
      <button disabled={validationOutcome == '' || validationOutcome == 'loading'}>download validation report</button>
      <button disabled={validationOutcome != 'successful'} onClick={handleFileStore}>store</button>

      <StorageMsg outcome={storeOutcome} />

      <div>
        <Link to="/user/get-started">back</Link>
      </div>
    </>
  );
}
