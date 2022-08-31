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

function AddCategory() {
    const navigate = useNavigate()
    const nameRef = useRef(null)
    const pRef = useRef(null)
    const ctx = useContext(AuthContext)

    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [snackBarType, setSnackBarType] = useState('success')

    const closeSnackBar = () => setOpenSnackBar(false);

    const addCategory = () => {
        const categoryName = nameRef.current.querySelector('input[type=text]').value
        const picFile = pRef.current.querySelector('input[type=file]').files

        var formdata = new FormData();
        formdata.append("name", categoryName);
        formdata.append("picture", picFile[0]);

        fetch(`http://localhost:5000/categories/add`, {
            method: 'post',
            headers: {
                'Authorization': 'Bearer ' + ctx.token
            },
            body: formdata,
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
        // }).catch(e => e) 
        
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
                                        <MDInput  ref={nameRef} type="text" label="Category Name" variant="standard" fullWidth />
                                    </MDBox>
                                    <MDBox mb={2}>
                                        <MDInput ref={pRef} type="file" label="Photo" variant="standard" fullWidth />
                                    </MDBox>
                                    <MDBox mt={4} mb={1}>
                                        <MDButton variant="gradient" color="info" fullWidth onClick={addCategory}>
                                            add category
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

export default AddCategory