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

// Authentication layout components
import {useRef} from "react";

// @mui material components
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/bg-sign-up-cover.jpeg";
import { useNavigate } from "react-router-dom";

function SignUp() {

  const navigate = useNavigate()

  const nameRef = useRef(null)
  const userNameRef = useRef(null)
  const emailRef = useRef(null)
  const passwordRef = useRef(null)

  const signUp = () => {

        const name = nameRef.current.querySelector('input[type=text]').value
        const username = userNameRef.current.querySelector('input[type=text]').value
        const email = emailRef.current.querySelector('input[type=email]').value
        const password = passwordRef.current.querySelector('input[type=password]').value
        const isAdmin = "isAdmin"

        fetch(`http://localhost:5000/users/signup`, {
            method: 'POST',
            body: JSON.stringify({
                name,
                username,
                email,
                password,
                isAdmin
            }),
            headers:{
                'Content-Type': 'application/json',
            }
        }).then(response => response.json())
            .then(result => {
                console.log(result)
                navigate("/sign-in")
            }).catch((error) => {
                console.error('Error:', error);
            });


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
						Sign up
					</MDTypography>
					<br/>
				</MDBox>
				<MDBox pt={4} pb={3} px={3}>
					<MDBox component="form" role="form">
            <MDBox mb={2}>
							<MDInput type="text" label="Last Name" fullWidth ref={nameRef} />
						</MDBox>
            <MDBox mb={2}>
							<MDInput type="text" label="Username" fullWidth ref={userNameRef} />
						</MDBox>
						<MDBox mb={2}>
							<MDInput type="email" label="Email" fullWidth ref={emailRef} />
						</MDBox>
						<MDBox mb={2}>
							<MDInput type="password" label="Password" fullWidth ref={passwordRef} />
						</MDBox>
						<MDBox mt={4} mb={1}>
							<MDButton variant="gradient" color="info" fullWidth onClick={signUp}>
								sign up
							</MDButton>
						</MDBox>
					</MDBox>
				</MDBox>
			</Card>
		</BasicLayout>
  );
}

export default SignUp;
