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

import { AuthContext } from "context/AuthContext";
import { Link } from "react-router-dom";

const columns = [
    { Header: "id", accessor: "id", align: "left" },
    { Header: "file_type", accessor: "file_type", align: "left" },
    { Header: "location", accessor: "location", align: "left" },
    { Header: "file", accessor: "file", align: "left" },
    { Header: "actions", accessor: "actions", align: "center" },
]
// const rows = []

function Files() {
    const [rows, setRows] = useState([])
    const ctx = useContext(AuthContext)

    const deleteCategory = (file_id) => {
        if (window.confirm('Are you sure')) {
            fetch(`http://localhost:5000/files/${file_id}`, {
                method: "DELETE",
                headers: {
                    'Authorization': 'Bearer ' + ctx.token
                }
            }).then(response => {
                response.json()
                    .then(deleted => {
                        console.log(deleted)
                    })
            })
                .catch(e => e)
        }
    }

    useEffect(() => {
        fetch(`http://localhost:5000/files`)
            .then(response => {
                response.json().then(files => {
                    const allCategories = files.data.map((file) => {
                        return {
                            id: <>{file.id}</>,
                            file_tyep: <>{file.file_type}</>,
                            location: <>{file.location}</>,
                            file: <><img src={file.file_name} width="80" /></>,
                            actions: <>
                                <MDButton variant="text" color="error" onClick={() => { deleteCategory(file.id) }}>
                                    <Icon>delete</Icon>&nbsp;delete
                                </MDButton>
                                {/* <Link to={`/files/edit/${file.id}`}>
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
                                        Files Table
                                    </MDTypography>
                                    <Link to='/files/add'>
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
            <Footer />
        </DashboardLayout>
    );
}

export default Files;
