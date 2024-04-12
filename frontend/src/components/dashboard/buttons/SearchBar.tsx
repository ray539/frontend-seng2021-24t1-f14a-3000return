import { TextField } from "@mui/material";


export default function SearchBar() {
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