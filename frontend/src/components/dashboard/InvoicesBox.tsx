/* eslint-disable @typescript-eslint/ban-types */
import { useContext, useEffect, useState } from "react";
import DownloadButton from "./buttons/DownloadButton";
import SendButton from "./buttons/SendButton";
import { AuthContext } from "../../context/AuthContextProvider";
import { EInvoiceItem } from "../../data";
import {
  getInvoicesBelongingTo,
  getPdfLink,
  getXmlData,
} from "../../service/service";
import {
  Button, Checkbox, FormControlLabel,
  Typography, Grid, Box,
	IconButton,
	Tooltip,
} from '@mui/material';
import GetStartedButton from "./buttons/GetStartedButton";
import SearchBar from "./buttons/SearchBar";
import DeleteButton from "./buttons/DeleteButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';

export default function InvoicesBox() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);

  useEffect(() => {
    console.log(user?.username, user?.password);
    getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
			setInvoices(invoices)
    );
  }, []);

	function changePdfButtonMsg(
    msg:
			| "generate pdf"
      | "fetching xml..."
      | "generating..."
      | "an error occured :(",
    i: number
  ) {
    const invoices_ = [...invoices];
    invoices_[i].pdfGenMsg = msg;
    setInvoices(invoices_);
  }

	const buttonWidth = "65%";

	function Header() {
		return (
			<>
				<Grid 
					container 
					justifyContent={"space-between"}
					alignItems={"center"}
				>
					<Grid item xs>
						<Typography variant="h4" fontWeight={"bold"}>Invoices</Typography>
					</Grid>
					<Grid item width={buttonWidth}>
						<GetStartedButton />
					</Grid>
				</Grid>
			</>
		);
	}

	function Buttons() {
		return (
			<>
				<Grid 
					container 
					justifyContent={"space-between"}
					alignItems={"center"}
					margin={"8px"}
					marginLeft={0}
					marginRight={0}
				>
					<Grid 
						item 
						xs 
						paddingRight={"8px"}
					>
						<SearchBar />
					</Grid>
					<Grid 
						container 
						width={buttonWidth}
						gap={"8px"}
					>
						<Grid item xs>
							<DownloadButton invoices={invoices}/>
						</Grid>
						<Grid item xs>
							<SendButton invoices={invoices}/>
						</Grid>
						<Grid item xs>
							<DeleteButton invoices={invoices} setInvoices={setInvoices}/>
						</Grid>
					</Grid>
				</Grid>
			</>
		);
	}

	function Invoice(invoice: EInvoiceItem, i: number) {
		async function getPDF() {
			changePdfButtonMsg("fetching xml...", i);
			const xmlData = await getXmlData(
				user!.username,
				user!.password,
				invoice.name
			);

			console.log(xmlData);
			changePdfButtonMsg("generating...", i);
			const link = await getPdfLink(
				user!.username,
				user!.password,
				xmlData
			);

			if (!link) {
				changePdfButtonMsg("an error occured :(", i);
				setTimeout(() => changePdfButtonMsg("generate pdf", i), 1000);
				return;
			}

			changePdfButtonMsg("generate pdf", i);
			setTimeout(() => window.open(link), 100);
		}

		return (
			<>
				<Grid 
					container 
					key={invoice.id} 
					wrap="nowrap"
					paddingLeft={2}
					paddingRight={2}
				>
					<Box width={"100%"}>
						<FormControlLabel
							control={
								<Checkbox
									checked={invoice.checked}
									onChange={(e) => {
										const invoices_ = [...invoices];
										invoices_[i].checked = e.target.checked;
										setInvoices(invoices_);
									}}
								/>
							}
							label={invoice.name} // Set the label of the checkbox to be the name of the invoice
							labelPlacement="end" // Align the label to the start of the checkbox
						/>
					</Box>
					<Grid 
						container
						justifyContent={"flex-end"}
						gap={1}
					>
						<Tooltip title="View eInvoice">
							<IconButton 
								aria-label="View"
								onClick={() => {
									window.open(`/user/view-invoice/${invoice.name}`);
								}}
							>
								<VisibilityIcon />
							</IconButton>
						</Tooltip>
						<Tooltip title="Generate PDF">
							<IconButton 
								aria-label="PDF"
								onClick={getPDF}
							>
								<PictureAsPdfIcon />
							</IconButton>
						</Tooltip>
					</Grid>
				</Grid>
			</>
		)
	}

	function Invoices() {
		return (
			<>
				<Box 
					padding={"10px"}
					sx={{ 
						bgcolor: "#F1E8FF", 
					}}
				>
					{invoices.length === 0 ? (
						<Typography>No Invoices!</Typography>
					) : (
						invoices.map((invoice, i) => (
							Invoice(invoice, i)
						))
					)}
				</Box>
			</>
		);
	}

	return (
		<>
			<Header />
			<Buttons />
			<Invoices />
		</>
	);
}