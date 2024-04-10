import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import {
  Typography, Grid, Paper, Link, Box
} from '@mui/material';
import { Container } from "react-bootstrap";

export default function ProfileBox() {
  const authContext = useContext(AuthContext);

	return (
		<>
			<Paper elevation={0} sx={{ paddingLeft: 3, paddingTop: 2, paddingBottom: 1, paddingRight: 3, height: "100%", marginTop: -3 }}>
				<Grid item xs={3}>
					<Typography variant="h3">Welcome, {authContext.currentUser?.username}!</Typography>
					{/* NO USER MANAGEMENT PAGE */}
					<br />
					<Link href="/user-profile" variant="body2">
						Manage account
					</Link>➡️
				</Grid>
				<br />
				<Container>
					<Typography variant="h6">
						Current plan: Premium <br />
					</Typography>
					<Typography variant="h6">
						Your team:
					</Typography>
					<Box bgcolor={"#cde6f7"} minHeight={250} display="flex" justifyContent="center" alignItems="center">
						<Typography variant="body2">
							You are currently not in a team
						</Typography>
					</Box>
				</Container>
			</Paper >
		</>
	)
}