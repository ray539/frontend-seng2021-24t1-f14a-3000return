/* eslint-disable @typescript-eslint/ban-types */
import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
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
	TextField
} from '@mui/material';

export default function InvoicesBox() {
	const navigate = useNavigate();
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);
  // const [showSendUI, setShowSendUI] = useState(false);

	const [deletedConfirmation, setDeleteConfirmation] = useState<{
    state: "hidden" | "shown" | "loading";
    numItems: number;
  }>({
    state: "hidden",
    numItems: 0,
  });

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

	return (
		<>
			<Grid container spacing={2} direction={"row"} justifyContent={"space-between"} wrap="nowrap" alignItems={"center"}>
				<Grid item>
					<Typography variant="h4">Invoices</Typography>
				</Grid>
				<Grid item width={"60%"}>
					<Button
						type="submit"
						fullWidth
						variant="contained"
						sx={{ mt: 1, mb: 1 }}
						onClick={() => {
							navigate("/user/get-started");
						}}
					>
						Get Started
					</Button>
				</Grid>
			</Grid>
			<Grid container spacing={2}>
				<Grid item>
					<TextField label="Search file" variant="outlined" />
				</Grid>

				<Grid item >
					<Button variant="contained">Download</Button>
				</Grid>

				<Grid item >
					<SendButton invoices={invoices}/>
				</Grid>

				<Grid item  >
					<Button variant="contained" onClick={() => {
						const numItems = invoices.filter((invoice) => invoice.checked).length;
						if (numItems == 0) return;
						setDeleteConfirmation({
							state: "shown",
							numItems: numItems,
						});
					}}>Delete</Button>
				</Grid>
			</Grid>

			<Box sx={{ bgcolor: "#cde6f7", marginTop: 2, paddingTop: "10px", minHeight: "34.5%" }}>
				{invoices.length === 0 ? (
					<Typography>No Invoices!</Typography>
				) : (
					invoices.map((invoice, i) => (
						<Box key={invoice.id} display={"flex"} justifyContent={"space-between"}>
							<Box>
								<FormControlLabel
									control={<Checkbox
										checked={invoice.checked}
										onChange={(e) => {
											const invoices_ = [...invoices];
											invoices_[i].checked = e.target.checked;
											setInvoices(invoices_);
										}}
									/>}
									label={invoice.name} // Set the label of the checkbox to be the name of the invoice
									labelPlacement="end" // Align the label to the start of the checkbox
								/>
							</Box>
							<Box>
								<Button variant="outlined" onClick={() => {
									window.open(`/user/view-invoice/${invoice.name}`);
								}}>View XML</Button>
								<Button variant="outlined" onClick={async () => {
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



			{/* {showSendUI && <SendButton invoices={invoices} showSendUI={showSendUI} setShowSendUI={setShowSendUI} />} */}

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