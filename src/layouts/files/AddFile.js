import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// @mui material components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
// Material Dashboard 2 React components
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Box from "@mui/material/Box";
// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import Footer from "examples/Footer";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import MDSnackbar from "components/MDSnackbar";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { useRequest } from "layouts/hooks";


function AddFile() {
  const locationRef = useRef(null);
  const fileRef = useRef(null);
  const sendRequest = useRequest()
  const [categories, setCategories] = useState([])
  const [selectedCategories, setSelectedCategories] = useState([])
  const [loading, setLoading] = useState(false);

  const ctx = useContext(AuthContext);
  const [serverResponse, setServerResponse] = useState(" ");
  const [snackBarType, setSnackBarType] = useState("success");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const closeSnackBar = () => setOpenSnackBar(false);

  // const [categories, setCategories] = useState(0);
  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_API_URL}categories`).then((response) => {
  //     response.json().then((categories) => {
  //       console.log(categories.data);
  //       setCategoriesData(categories.data);
  //     });
  //   });
  // }, []);

  const handleCategoryToggle = (e) => {
    const categoriesClone = [...selectedCategories]
    if (e.target.checked) {
        categoriesClone.push(e.target.value)  
    } else {
        categoriesClone.splice(categoriesClone.indexOf(e.target.value), 1)
    }
    setSelectedCategories(categoriesClone)
}
useEffect(() => {
  sendRequest("http://localhost:5000/categories")
      .then((response) => {
          setCategories(response?.data)
      })
}, [])

  const addFile = () => {
    
    const location = locationRef.current.querySelector("input[type=text]").value;
    const file_name = fileRef.current.querySelector("input[type=file]").files;

    var formdata = new FormData();

    formdata.append('location', location)
    for (var i = 0; i < selectedCategories.length; i++) {
        formdata.append('categories[]', selectedCategories[i])
    }
    formdata.append('file_name', file_name[0])
    fetch(`http://localhost:5000/files/add`, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + ctx.token,
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
  };
  // const handleCategoryChange = (event) => {
  //     setCategory(event.target.value)
  // }
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
                    <MDInput
                      ref={locationRef}
                      type="text"
                      label="location"
                      variant="standard"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <p>Select file</p>
                    <MDInput
                      ref={fileRef}
                      type="file"
                      variant="standard"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        {/* <InputLabel id="demo-simple-select-label">
                          Category
                        </InputLabel> */}
                        <div className="">
                            <label className="col-sm-3 col-form-label"><b>Select category</b></label>
                            <div className="row mb-4">
                                {
                                    categories?.map((category, i) => {
                                        return (
                                            <div className='my-2 col-md-4 col-lg-3'>
                                                <input onChange={handleCategoryToggle} type='checkbox' value={category.id} id={`category-${category.id}`} />
                                                <label key={i} htmlFor={`category-${category.id}`}>{category.name}</label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                      </FormControl>
                    </Box>
                  </MDBox>
                  {/* <MDBox mb={2}>
                                        <Box sx={{ minWidth: 120 }}>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">Category</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={''}
                                                    label="Category"
                                                    style={{padding: '20px 0'}}
                                                    onChange={(e) => {updateuserData({Category: {id: e.target.value}})}}
                                                >
                                                    {categories?.map((category, i) => {
                                                        return <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
                                                    })}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                    </MDBox> */}
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={addFile}
                    >
                      add File
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
        icon={snackBarType == "success" ? "check" : "warning"}
        title="Places App"
        content={serverResponse}
        open={openSnackBar}
        // onClose={closeSnackBar}
        close={closeSnackBar}
        dateTime=""
        bgWhite
      />
    </DashboardLayout>
  );
}
export default AddFile;
