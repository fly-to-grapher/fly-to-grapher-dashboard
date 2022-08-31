import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import DataTable from "examples/Tables/DataTable";
import { useEffect, useState, useContext } from "react";
import Icon from "@mui/material/Icon";
import MDButton from "components/MDButton";
import MDSnackbar from "components/MDSnackbar";

import { AuthContext } from "context/AuthContext";
import { Link } from "react-router-dom";

const columns = [
    { Header: "id", accessor: "id", align: "left" },
    { Header: "user type", accessor: "user type", align: "left" },
    { Header: "username", accessor: "username", align: "left" },
    { Header: "location", accessor: "location", align: "left" },
    { Header: "avatar", accessor: "avatar", align: "left" },
    { Header: "actions", accessor: "actions", align: "center" },
]
// const rows = []

function User() {
    const [rows, setRows] = useState([])
    const ctx = useContext(AuthContext)

    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [snackBarType, setSnackBarType] = useState('success')

    const closeSnackBar = () => setOpenSnackBar(false);


    const deleteCategory = (user_id) => {
        if (window.confirm('Are you sure')) {
            fetch(`http://localhost:5000/users/${user_id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + ctx.token
                }
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
    }

    useEffect(() => {
        fetch(`http://localhost:5000/users`)
            .then(response => {
                response.json().then(users => {
                    const allCategories = users.data.map((user) => {
                        return {
                            id: <>{user.id}</>,
                            user_type: <>{user.isAdmin}</>,
                            username: <>{user.username}</>,
                            location: <>{user.location}</>,
                            avatar: <><img src={user.avatar} style={{ width: "5em", height: "5em", borderRadius: "50%" }} /></>,
                            actions: <>
                                <MDButton variant="text" color="error" onClick={() => { deleteCategory(user.id) }}>
                                    <Icon>delete</Icon>&nbsp;delete
                                </MDButton>
                                {/* <Link to={`/users/edit/${avatar.id}`}>
                                    <MDButton variant="text" color="info">
                                        <Icon>delete</Icon>&nbsp;Delete
                                    </MDButton>
                                </Link> */}
                            </>,
                        }
                    })
                    setRows(allCategories)
                })
            })
    }, [])
    return (
        <DashboardLayout>
            <DashboardNavbar />
            <MDBox pt={6} pb={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        <Card>
                            <MDBox
                                mx={2}
                                mt={-3}
                                py={3}
                                px={2}
                                variant="gradient"
                                bgColor="info"
                                borderRadius="lg"
                                coloredShadow="info"
                            >
                                <Grid
                                    container
                                    direction="row"
                                    justifyContent="space-between"
                                    alignItems="center"
                                >
                                    <MDTypography variant="h6" color="white">
                                        Users Table
                                    </MDTypography>
                                    <Link to='/users/add'>
                                        <MDButton variant="text">
                                            <Icon>add_circle</Icon>&nbsp;Add
                                        </MDButton>
                                    </Link>
                                </Grid>

                            </MDBox>
                            <MDBox pt={3}>
                                <DataTable
                                    table={{ columns, rows }}
                                    isSorted={false}
                                    entriesPerPage={false}
                                    showTotalEntries={false}
                                    noEndBorder
                                />
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
            <Footer />
        </DashboardLayout>
    );
}

export default User;
