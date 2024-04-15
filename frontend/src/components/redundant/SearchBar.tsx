import { TextField } from "@mui/material";
// import { useEffect, useState } from "react";
// import { useEffect } from "react";
// import { getInvoicesBelongingTo } from "../../../service/service";
// import { AuthContext } from "../../../context/AuthContextProvider";

export default function SearchBar() {
	// const [search, setSearch] = useState('')

	// const handleInputChange = (input:any) => {
	// 	setSearch(input.target.value);

	// }

	// useEffect(() => {

	// });

	return (
		<>
			<TextField 
				label="Search invoices" 
				type="search"
				variant="outlined" 
				size="small"
				fullWidth
				// onChange={handleInputChange}
			/>
		</>
	);
}