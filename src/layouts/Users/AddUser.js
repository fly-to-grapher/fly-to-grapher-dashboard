import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";

import MDSnackbar from "components/MDSnackbar";

import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom"

import { useContext, useRef, useState } from "react";
import { AuthContext } from "context/AuthContext";

function User() {
    const navigate = useNavigate()
    const pRef = useRef(null)
    const ctx = useContext(AuthContext)
    const nameRef = useRef(null)
    const userNameRef = useRef(null)
    const emailRef = useRef(null)
    const passwordRef = useRef(null)
    const isAdminRef = useRef(null)


    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [snackBarType, setSnackBarType] = useState('success')

    const closeSnackBar = () => setOpenSnackBar(false);

    const addUser = () => {
        const name = nameRef.current.querySelector('input[type=text]').value
        const username = userNameRef.current.querySelector('input[type=text]').value
        const email = emailRef.current.querySelector('input[type=email]').value
        const password = passwordRef.current.querySelector('input[type=password]').value
        const isAdmin = isAdminRef.current.querySelector('input[type=number]').value

        fetch(`http://localhost:5000/users/add`, {
            method: 'post',
            body: JSON.stringify({
                name,
                email,
                username,
                password,
                isAdmin
            }),
        })
        .then((response) => response.json())
        .then((result) => {
            console.log(result);
            setServerResponse(result.messages.join(" "));
            if (result.success) {
            setSnackBarType("success");
            } else {
            setSnackBarType("error");
            }
            setOpenSnackBar(true);
        })
        .catch((error) => {
            console.error("Error:", error);
        });
        
    }

    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox pt={4} pb={3} px={3}>
                                <MDBox component="form" role="form">
                                    <MDBox mb={2}>
                                        <MDInput  ref={nameRef} type="text" label="Name" variant="standard" fullWidth />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <MDInput  ref={emailRef} type ='email' label="Email" variant="standard" fullWidth />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <MDInput  ref={userNameRef} type="text" label="Userame" variant="standard" fullWidth />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <MDInput  ref={isAdminRef} type="number" label="User Type" variant="standard" fullWidth />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <MDInput  ref={passwordRef} type="password" label="Password" variant="standard" fullWidth />
                                    </MDBox>
                                    <MDBox mt={4} mb={1}>
                                        <MDButton variant="gradient" color="info" fullWidth onClick={addUser}>
                                            Add User
                                        </MDButton>
                                    </MDBox>
                                </MDBox>
                            </MDBox>
                        </Card>
                    </Grid>
                </Grid>
            </MDBox>

            <MDSnackbar
                color={snackBarType}
                icon={snackBarType == 'success' ? 'check' : 'warning'}
                title="Recipe App"
                content={serverResponse}
                open={openSnackBar}
                // onClose={closeSnackBar}
                close={closeSnackBar}
                dateTime=""
                bgWhite
            />

        </DashboardLayout>
    )
}

export default User









// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// // @mui material components
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// // Material Dashboard 2 React components
// import MDButton from "components/MDButton";
// import MDInput from "components/MDInput";
// import Box from '@mui/material/Box';

// // Material Dashboard 2 React components
// import MDBox from "components/MDBox";
// import MDTypography from "components/MDTypography";
// import Footer from "examples/Footer";
// import { useEffect, useRef, useState } from "react";
// import { useContext } from "react";
// import { AuthContext } from "context/AuthContext";
// import MDSnackbar from "components/MDSnackbar";
// import Select from '@mui/material/Select';
// import InputLabel from '@mui/material/InputLabel';
// import FormControl from '@mui/material/FormControl';

// import MenuItem from '@mui/material/MenuItem';
// import { useNavigate } from "react-router-dom"


// function AddUser() {

//     const nameRef = useRef(null)
//     const userNameRef = useRef(null)
//     const emailRef = useRef(null)
//     const passRef = useRef(null)
//     const isAdminRef = useRef(null)


//     const ctx = useContext(AuthContext)
//     const [serverResponse, setServerResponse] = useState(" ")
//     const [snackBarType, setSnackBarType] = useState("success")
//     const [openSnackBar, setOpenSnackBar] = useState(false)
//     const closeSnackBar = () => setOpenSnackBar(false);
//     const navigate = useNavigate()

//     const saveuser = () => {
//         const name = nameRef.current.querySelector('input[type=text]').value
//         const username = userNameRef.current.querySelector('input[type=text]').value
//         const email = emailRef.current.querySelector('input[type=email]').value
//         const pass = passRef.current.querySelector('input[type=password]').value
//         const isAdmin = isAdminRef.current.querySelector('input[type=text]').value

//         fetch(`http://localhost:5000/users/signup`, {
//             method: 'POST',
//             headers: {
//                 'Authorization': 'Bearer ' + ctx.token,
//                 'Content-Type' :'application/json'
//             },
//             body:JSON.stringify({
//                 name:name,
//                 username :username,
//                 email : email,
//                 password:pass,
//                 isAdmin : isAdmin
//             })
//         }).then(response => response.json())
//             .then(result => {
//                 console.log(result)
//                 setServerResponse(result.messages)
//                 if (result.success) {
//                     setSnackBarType('success')
//                     navigate('/users')
//                 } else {
//                     setSnackBarType('error')
//                 }
//                 setOpenSnackBar(true)
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//     }
//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <MDBox pt={6} pb={3}>
//                 <Grid container spacing={6}>
//                     <Grid item xs={12}>
//                         <Card>
//                             <MDBox
//                                 mx={2}
//                                 mt={-3}
//                                 py={3}
//                                 px={2}
//                                 variant="gradient"
//                                 bgColor="info"
//                                 borderRadius="lg"
//                                 coloredShadow="info"
//                             >
//                                 <MDTypography variant="h6" color="white">
//                                     Add user
//                                 </MDTypography>
//                             </MDBox>
//                             <MDBox pt={4} pb={3} px={3}>
//                                 <MDBox component="form" role="form">
//                                     <MDBox mb={2}>
//                                         <MDInput type="text" label=" name" variant="standard" fullWidth ref={nameRef} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput type="text" label="username" variant="standard" fullWidth ref={userNameRef} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput type="email" label="Email" variant="standard" fullWidth ref={emailRef} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput type="number" min="0" max='1' label="user type" variant="standard" fullWidth ref={isAdminRef} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput type="password" label="password" variant="standard" fullWidth ref={passRef} />
//                                     </MDBox>
//                                     <MDBox mt={4} mb={1}>
//                                         <MDButton variant="gradient" color="info" fullWidth onClick={saveuser}>
//                                             Add user
//                                         </MDButton>
//                                     </MDBox>
//                                 </MDBox>
//                             </MDBox>
//                         </Card>
//                     </Grid>
//                 </Grid>
//             </MDBox>
//             <MDSnackbar
//                 color={snackBarType}
//                 icon={snackBarType == 'success' ? 'check' : 'warning'}
//                 title="users App"
//                 content={serverResponse}
//                 open={openSnackBar}
//                 onClose={closeSnackBar}
//                 close={closeSnackBar}
//                 dateTime=""
//                 bgWhite
//             />
//             <Footer />
//         </DashboardLayout>
//     )
// }
// export default AddUser