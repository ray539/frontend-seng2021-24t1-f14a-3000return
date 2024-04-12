import { TextField } from "@mui/material";
import { EInvoiceItem } from "../../../data";
import { useContext, useEffect, useState } from "react";
import { getInvoicesBelongingTo } from "../../../service/service";
import { AuthContext } from "../../../context/AuthContextProvider";


export default function SearchBar() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
	const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);

	useEffect(() => {
    console.log(user?.username, user?.password);
    getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
			setInvoices(invoices)
    );
  }, []);
	
	return (
		<>
			<TextField 
				label="Search invoices" 
				type="search"
				variant="outlined" 
				size="small"
				fullWidth
			/>
		</>
	);
}