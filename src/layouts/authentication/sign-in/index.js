/**
=========================================================
* Material Dashboard 2 React - v2.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/material-dashboard-react
* Copyright 2022 Creative Tim (https://www.creative-tim.com)

Coded by www.creative-tim.com

 =========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/

import { useState, useRef, useContext } from "react";
// import { AuthContext } from "context/AuthContext";

// react-router-dom components
import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import Grid from "@mui/material/Grid";
import MuiLink from "@mui/material/Link";

// @mui icons
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import {AuthContext} from "../../../context/AuthContext";
// Images
import bgImage from "assets/images/bg-sign-in-basic.jpeg";
import { useRequest } from "layouts/hooks";

function Basic() {

	const ctx = useContext(AuthContext)
	const navigate = useNavigate()
    const sendRequest = useRequest()

	const [rememberMe, setRememberMe] = useState(false);

	const userNameOrEmailRef = useRef(null)
	const passwordRef = useRef(null)

	const handleSetRememberMe = () => setRememberMe(!rememberMe);

	const login = () => {
		// userNameOrEmail: event.target.querySelector('input[name=userNameOrEmail]').value,
		const userNameOrEmail = userNameOrEmailRef.current.querySelector('input[type=userNameOrEmail]').value
		const password = passwordRef.current.querySelector('input[type=password]').value
		sendRequest(`http://localhost:5000/users/login`, {}, {
            userNameOrEmail ,
            password
        }, { type: 'json' }, 'POST')
            .then((response) => {
                if (response.success) {
                    ctx.login(response)
                    navigate('/dashboard')
                } else {
                    window.alert(response?.messages?.join(' '))
                }
            });
		
		// fetch(`http://localhost:5000/users/login`,  {
		// 	method: 'POST',
		// 	body: JSON.stringify({
		// 		userNameOrEmail,
		// 		password
		// 	}),
		// 	headers: {
		// 		'Content-Type': 'application/json'
		// 	},
			
		// }).then(response => {
		// 	response.json().then(loggedIn => {
				
		// 	if (loggedIn.success) {
		// 	ctx.login(response)
		// 	window.localStorage.setItem("token", loggedIn.data.token)
		// 			navigate('/dashboard')
		// 	}
		// 	})
		// }).catch((e) => {
		// console.log(e)
			
		// })

	}

	return (
		<BasicLayout image={bgImage}>
			<Card>
				<MDBox
					variant="gradient"
					bgColor="info"
					borderRadius="lg"
					coloredShadow="info"
					mx={2}
					mt={-3}
					p={2}
					mb={1}
					textAlign="center"
				>
					<MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
						Sign in
					</MDTypography>
					<Grid container spacing={3} justifyContent="center" sx={{ mt: 1, mb: 2 }}>
						<Grid item xs={2}>
							<MDTypography component={MuiLink} href="#" variant="body1" color="white">
								<FacebookIcon color="inherit" />
							</MDTypography>
						</Grid>
						<Grid item xs={2}>
							<MDTypography component={MuiLink} href="#" variant="body1" color="white">
								<GitHubIcon color="inherit" />
							</MDTypography>
						</Grid>
						<Grid item xs={2}>
							<MDTypography component={MuiLink} href="#" variant="body1" color="white">
								<GoogleIcon color="inherit" />
							</MDTypography>
						</Grid>
					</Grid>
				</MDBox>
				<MDBox pt={4} pb={3} px={3}>
					<MDBox component="form" role="form">
						<MDBox mb={2}>
							<MDInput type="userNameOrEmail" label="Email" fullWidth ref={userNameOrEmailRef} />
						</MDBox>
						<MDBox mb={2}>
							<MDInput type="password" label="Password" fullWidth ref={passwordRef} />
						</MDBox>
						<MDBox display="flex" alignItems="center" ml={-1}>
							<Switch checked={rememberMe} onChange={handleSetRememberMe} />
							<MDTypography
								variant="button"
								fontWeight="regular"
								color="text"
								onClick={handleSetRememberMe}
								sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
							>
								&nbsp;&nbsp;Remember me
							</MDTypography>
						</MDBox>
						<MDBox mt={4} mb={1}>
							<MDButton variant="gradient" color="info" fullWidth onClick={login}>
								sign in
							</MDButton>
						</MDBox>
						<MDBox mt={3} mb={1} textAlign="center">
							<MDTypography variant="button" color="text">
								Don&apos;t have an account?{" "}
								<MDTypography
									component={Link}
									to="/authentication/sign-up"
									variant="button"
									color="info"
									fontWeight="medium"
									textGradient
								>
									Sign up
								</MDTypography>
							</MDTypography>
						</MDBox>
					</MDBox>
				</MDBox>
			</Card>
		</BasicLayout>
	);
}

export default Basic;
