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
  Checkbox, FormControlLabel,
  Typography, Grid, Box,
  IconButton,
  Tooltip,
  TextField,
} from '@mui/material';
import GetStartedButton from "./buttons/GetStartedButton";
import DeleteButton from "./buttons/DeleteButton";
import VisibilityIcon from '@mui/icons-material/Visibility';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ManageTagButton from "./buttons/ManageTagButton";
import { evaluateString } from "./buttons/TagSelectionEvaluator";

const buttonWidth = "65%";

function Header({invoices}: {invoices: EInvoiceItem[]}) {
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
					<GetStartedButton invoices={invoices} />
				</Grid>
			</Grid>
		</>
	);
}

function Buttons({
	search, 
	setSearch,
	tagSelectionTxt,
	setTagSelectionTxt,
	invoices,
	setInvoices
}: {search: string, setSearch: Function, tagSelectionTxt: string, setTagSelectionTxt: Function, invoices: EInvoiceItem[], setInvoices: Function}) {
	return (
		<>
			<Grid
				container
				justifyContent={"space-between"}
				alignItems={"center"}
			>
				<Grid
					item
					xs
					paddingRight={"8px"}
				>
					<Box sx={{display:'flex', justifyContent: 'space-between'}}>
						<TextField 
							label="search invoices" 
							type="search"
							variant="outlined" 
							size="small"
							fullWidth
							sx={{marginRight: '1em'}}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
						/>
						<TextField 
							fullWidth 
							sx={{marginRight: '1em'}} 
							label="tag selection string" 
							size='small'
							value={tagSelectionTxt}
							onChange={(e) => {
								let newVal = e.target.value.toUpperCase()
								if (!/^[A-Z0-9_\-,|\(\)]*$/.test(newVal)) {
									console.log('here');
									return;
								}
								setTagSelectionTxt(newVal)}}
						/>
					</Box>
					<Box sx={{display: 'flex', justifyContent: 'right'}}>
						<Typography sx={{marginRight: '1em'}}>what's this?</Typography>
					</Box>
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
						<DeleteButton invoices={invoices} setInvoices={setInvoices}/>
					</Grid>
				</Grid>
			</Grid>
		</>
	);
}

function Invoice({
		invoice,
		i,
		invoices,
		setInvoices
	} : {
		invoice: EInvoiceItem, 
		i: number, 
		invoices: EInvoiceItem[], 
		setInvoices: Function
	}) {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;

	async function getPDF() {
		const xmlData = await getXmlData(
			user!.username,
			user!.password,
			invoice.name
		);

		// console.log(xmlData);
		const link = await getPdfLink(
			user!.username,
			user!.password,
			xmlData
		);

		setTimeout(() => window.open(link), 100);
	}

	return (
		<>
			<Grid 
				container
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
					sx={{
						flexWrap: 'nowrap',
						alignItems: 'center'
					}}
					gap={1}
				>
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
					{user!.accountType !== 'Free' ? (
              <Tooltip title="Generate PDF">
                <IconButton
                  aria-label="PDF"
                  onClick={getPDF}
                >
                  <PictureAsPdfIcon />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Upgrade to Premium to generate PDF">
                <span>
                  <IconButton
                    aria-label="PDF"
                    disabled
                  >
                    <PictureAsPdfIcon />
                  </IconButton>
                </span>
              </Tooltip>
            )
					}
				</Grid>
			</Grid>
		</>
	)
}

function Invoices({invoices, setInvoices, search, tagSelectionTxt}: {invoices: EInvoiceItem[], setInvoices: Function, search: string, tagSelectionTxt: string}) {
	const [selectAll, setSelectAll] = useState(false);
	const shownInvoices = invoices.filter(invoice => {
		const res1 = evaluateString(invoice, tagSelectionTxt) == 'true'
		const res2 = RegExp(search).test(invoice.name)
		return res1 && res2
	})


	return (
		<>
			<Grid
				item
				display={"flex"}
				flexDirection={"column"}
				padding={"10px"}
				width={"100%"}
				sx={{
					bgcolor: "#F1E8FF",
				}}
			>
				<Grid 
					container 
					wrap="nowrap"
					paddingLeft={2}
					paddingRight={2}
				>
					<Box 
						width={"100%"}
						borderBottom={"1px solid black"}
					>
						<FormControlLabel
							control={
								<Checkbox
									checked={selectAll}
									onChange={(e) => {
										setSelectAll(e.target.checked);
										invoices.map((invoice) => invoice.checked = !selectAll)
									}}
								/>
							}
							label={"Name"} // Set the label of the checkbox to be the name of the invoice
						/>
					</Box>
				</Grid>


				{
					invoices.length === 0 ? (
						<Typography>No Invoices!</Typography>
					) : (
						shownInvoices.map((invoice, i) => (
							<Invoice key={invoice.id} invoice={invoice} i={i} invoices={invoices} setInvoices={setInvoices}/>
						))
					)
				}
			</Grid>
		</>
	);
}

export default function InvoicesBox() {
  const authContext = useContext(AuthContext);
  const user = authContext.currentUser;
  const [invoices, setInvoices] = useState<EInvoiceItem[]>([]);
  const [search, setSearch] = useState("");
	const [tagSelectionTxt, setTagSelectionTxt] = useState('')

  useEffect(() => {
    console.log(user?.username, user?.password);
    getInvoicesBelongingTo(user!.username, user!.password).then((invoices) =>
      setInvoices(invoices)
    );
  }, []);

  return (
    <>
      <Grid
        container
        height={"100%"}
        alignContent={"flex-start"}
        alignItems={"stretch"}
        gap={"8px"}
      >
        <Header invoices={invoices}/>
        <Buttons 
					search={search} 
					setSearch={setSearch} 
					invoices={invoices} 
					setInvoices={setInvoices}
					tagSelectionTxt={tagSelectionTxt}
					setTagSelectionTxt={setTagSelectionTxt}
				/>
        <Invoices 
					invoices={invoices}
					setInvoices={setInvoices}
					search={search} 
					tagSelectionTxt={tagSelectionTxt}				/>
      </Grid>
    </>
  );
}