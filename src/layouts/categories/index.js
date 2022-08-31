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
    { Header: "name", accessor: "name", width: "45%", align: "left" },
    { Header: "photo", accessor: "photo", align: "left" },
    { Header: "actions", accessor: "actions", align: "center" },
]
// const rows = []

function Categories() {
    const [rows, setRows] = useState([])
    const ctx = useContext(AuthContext)

    const [openSnackBar, setOpenSnackBar] = useState(false)
    const [serverResponse, setServerResponse] = useState('')
    const [snackBarType, setSnackBarType] = useState('success')
    
    const closeSnackBar = () => setOpenSnackBar(false);


    const deleteCategory = (categoryId) => {
        if (window.confirm('Are you sure')) {
            fetch(`http://localhost:5000/categories/${categoryId}`, {
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
        fetch(`http://localhost:5000/categories`)
            .then(response => {
                response.json().then(categories => {
                    const allCategories = categories.data.map((category) => {
                        return {
                            name: <>{category.name}</>,
                                photo: <><img src={category.picture} width="80" /></>,
                                // icon: <><img src={category.icon} width="80" /></>,
                            actions: <>
                                <MDButton variant="text" color="error" onClick={() => { deleteCategory(category.id) }}>
                                    <Icon>delete</Icon>&nbsp;delete
                                </MDButton>
                                {/* <Link to={`/categories/edit/${category.id}`}>
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
                                        Categories Table
                                    </MDTypography>
                                    <Link to='/categories/add'>
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

export default Categories;
