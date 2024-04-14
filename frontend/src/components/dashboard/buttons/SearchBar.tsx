import { Box, Link, TextField, Typography } from "@mui/material";
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
			<Box sx={{display:'flex', justifyContent: 'space-between'}}>
				<TextField 
					label="search invoices" 
					type="search"
					variant="outlined" 
					size="small"
					fullWidth
					sx={{marginRight: '1em'}}
				/>
				<TextField fullWidth sx={{marginRight: '1em'}} label="tag selection string" size='small'></TextField>
			</Box>

			<Box sx={{display: 'flex', justifyContent: 'right'}}>
				<Typography sx={{marginRight: '1em'}}>what's this?</Typography>
			</Box>
		</>
	);
}