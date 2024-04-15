/* eslint-disable @typescript-eslint/ban-types */
import { useContext, useEffect, useState } from "react";
import DownloadButton from "./buttons/DownloadButton";
import SendButton from "./buttons/SendButton";
import { AuthContext } from "../../context/AuthContextProvider";
import { EInvoiceItem } from "../../data";
import {
	deleteInvoicesFromUser,
	getInvoicesBelongingTo,
	getPdfLink,
	getXmlData,
} from "../../service/service";
import {
	Button, Checkbox, FormControlLabel,
	Typography, Grid, Box,
	TextField,
} from '@mui/material';
import GetStartedButton from "./buttons/GetStartedButton";
import SearchBar from "./buttons/SearchBar";
import ManageTagButton from "./buttons/ManageTagButton";
import { evaluateString } from "./buttons/TagSelectionEvaluator";

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

function Buttons({
	invoiceSearchTxt,
	setInvoiceSearchTxt,
	tagSelectionTxt,
	setTagSelectionTxt,
	invoices,
	setInvoices,
	deletedConfirmation,
	setDeleteConfirmation
	}: {
		invoiceSearchTxt: string,
		setInvoiceSearchTxt: Function,
		tagSelectionTxt: string,
		setTagSelectionTxt: Function,
		invoices: EInvoiceItem[],
		setInvoices: Function,
		deletedConfirmation: {state: string, numItems: number},
		setDeleteConfirmation: Function
	}) {
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
					<SearchBar
						invoiceSearchTxt={invoiceSearchTxt}
						setInvoiceSearchTxt={setInvoiceSearchTxt}
						tagSelectionTxt={tagSelectionTxt}
						setTagSelectionText={setTagSelectionTxt}
					/>

				</Grid>

				<Grid
					container
					width={buttonWidth}
					gap={"8px"}
				>
					<Grid item xs>
						<DownloadButton invoices={invoices} />
					</Grid>

					<Grid item xs>
						<SendButton invoices={invoices} />
					</Grid>

					<Grid item xs>
						<Button
							variant="contained"
							fullWidth
							sx={{
								backgroundColor: "#F22556",
								'&:hover': {
									backgroundColor: "#d71e4a",
								}
							}}
							onClick={() => {
								const numItems = invoices.filter((invoice) => invoice.checked).length;
								if (numItems == 0) return;
								setDeleteConfirmation({
									state: "shown",
									numItems: numItems,
								});
							}
							}>
							Delete
						</Button>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}


function Invoices({
	invoices,
	setInvoices,
	changePdfButtonMsg
}: {
	invoices: EInvoiceItem[],
	setInvoices: Function,
	changePdfButtonMsg: Function
}) {
	const authContext = useContext(AuthContext)
	const user = authContext.currentUser

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
						<Box key={invoice.id} display={"flex"} justifyContent={"space-between"}>
							<Box>
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
							<Box sx={{display:'flex', alignItems: 'center'}}>
								<ManageTagButton invoices={invoices} setInvoices={setInvoices} index={i}/>

								<Box sx={{
									marginLeft: '0.5em',
									marginRight: '0.5em', 
									width: '200px',
									display: 'flex', 
									padding: '0.25em', 
									borderRadius: '5px',
									
								}}>
									<Box sx={{overflow: 'hidden', display: 'flex'}}>
										{
											invoice.tags.length == 0 ?
											<Typography sx={{color: 'grey'}}>no tags</Typography>
											:

											invoice.tags.map((tag) => 
												<Typography key={tag} fontSize={15} sx={{
													marginRight: '0.5em',
													borderRadius: '5px', 
													padding: '0.1em', 
													backgroundColor: 'grey',
													color: 'white',
													textWrap: 'nowrap'
												}}>{tag}</Typography>
											)

										}
									</Box>
								</Box>
								
								<Button variant="outlined" onClick={() => {
									window.open(`/user/view-invoice/${invoice.name}`);
								}}>View XML</Button>
								<Button variant="outlined" disabled={invoice.pdfGenMsg != 'generate pdf'} onClick={async () => {
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
								}}>{invoice.pdfGenMsg}</Button>
							</Box>
						</Box>
					))
				)}
			</Box>
		</>
	);
}

export default function InvoicesBox() {
	const authContext = useContext(AuthContext);
	const user = authContext.currentUser;

	const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);
	const [invoiceSearchTxt, setInvoiceSearchTxt] = useState('')
	const [tagSelectionTxt, setTagSelectionTxt] = useState('')

	const [deletedConfirmation, setDeleteConfirmation] = useState<{
		state: "hidden" | "shown" | "loading";
		numItems: number;
	}>({
		state: "hidden",
		numItems: 0,
	});

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

	useEffect(() => {
		console.log(user?.username, user?.password);
		getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
			setInvoices(invoices)
		);
	}, []);

	useEffect(() => {
		console.log(user?.username, user?.password);
		getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
			setInvoices(invoices)
		);
	}, []);

	const shownInvoices = invoices.filter(invoice => {
		const res = evaluateString(invoice, tagSelectionTxt)
		if (res == 'true') {
			return true
		}
		return false
	})

	return (
		<>
			<Header />
			<Buttons 
				invoiceSearchTxt={invoiceSearchTxt} 
				setInvoiceSearchTxt={setInvoiceSearchTxt} 
				tagSelectionTxt={tagSelectionTxt} 
				setTagSelectionTxt={setTagSelectionTxt} 
				invoices={invoices}
				setInvoices={setInvoices} 
				deletedConfirmation={deletedConfirmation} 
				setDeleteConfirmation={setDeleteConfirmation} 
			/>
			<Invoices 
				invoices={shownInvoices}
				setInvoices={setInvoices}
				changePdfButtonMsg={changePdfButtonMsg} 
			/>

			{deletedConfirmation.state != "hidden" && (
				<div>
					{deletedConfirmation.state == "shown" ? (
						<>
							<Typography variant="h5">Delete Items</Typography>
							<div>Delete these {deletedConfirmation.numItems} items?'</div>
						</>

					) : (
						<div>Loading</div>
					)}
					<Button onClick={async () => {
						const names = invoices
							.filter((invoice) => invoice.checked)
							.map((invoice) => invoice.name);
						setDeleteConfirmation({
							...deletedConfirmation,
							state: "loading",
						});
						await deleteInvoicesFromUser(
							user!.username,
							user!.password,
							names
						);

						setInvoices(invoices.filter((invoice) => !invoice.checked));
						setDeleteConfirmation({
							...deletedConfirmation,
							state: "hidden",
						});
					}}>Yes</Button>
					<Button onClick={() =>
						setDeleteConfirmation({ ...deletedConfirmation, state: "hidden" })
					}>No</Button>
				</div>
			)}
		</>
	);
}