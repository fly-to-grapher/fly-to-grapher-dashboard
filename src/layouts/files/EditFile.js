import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import Box from "@mui/material/Box";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { useEffect, useRef, useState } from "react";
import { useContext } from "react";
import { AuthContext } from "context/AuthContext";
import MDSnackbar from "components/MDSnackbar";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { Wrapper } from "@googlemaps/react-wrapper";
import { useParams } from "react-router-dom";

import * as React from "react";
import { configure } from "@testing-library/react";

function EditFile() {
  const RPRef = useRef(null);
  const BPRef = useRef(null);

  const ctx = useContext(AuthContext);

  const [RecipeData, setRecipeData] = useState({
    name: "",
    description: "",
    youtube_video: "",
    // Categories: [
    //   {
    //     id: "",
    //   },
    // ],
  });

  const { id } = useParams();

  // check
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}recipes/${id}`, {
      headers: {
        Authorization: "Bearer " + ctx.token,
      },
    })
      .then((response) => {
        response.json().then((currentRecipe) => {
          setRecipeData(currentRecipe.data);
          console.log(currentRecipe, "----------");
        });
      })
      .catch((e) => e);
  }, []);
  // console.log(RecipeData, "---");

  const [serverResponse, setServerResponse] = useState(" ");
  const [snackBarType, setSnackBarType] = useState("success");
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const closeSnackBar = () => setOpenSnackBar(false);

  const [CategoriesData, setCategoriesData] = useState([]);

  //   check
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}categories`, {
      headers: {
        Authorization: "Bearer " + ctx.token,
      },
    }).then((response) => {
      response.json().then((categories) => {
        setCategoriesData(categories.data);
      });
    });
  }, []);

  const saveRecipe = () => {
    const recipe_photo = RPRef.current.querySelector("input[type=file]").files;
    const background_photo = BPRef.current.querySelector("input[type=file]").files;

    var formdata = new FormData();
    formdata.append("name", RecipeData.name);
    formdata.append("description", RecipeData.description);
    formdata.append("youtube_video", RecipeData.youtube_video);

    //check
    formdata.append("categories", RecipeData.Categories[0].id);

    formdata.append("recipe_photo", recipe_photo[0]);
    formdata.append("background_photo", background_photo[0]);

    //check
    fetch(`${process.env.REACT_APP_API_URL}recipes/${id}`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + ctx.token,
      },
      body: formdata,
    })
      .then((response) => response.json())
      .then((result) => {
        setServerResponse(result.message.join(" "));
        if (result.success) {
          setSnackBarType("success");
        } else {
          setSnackBarType("error");
        }
        setOpenSnackBar(true);
      })
      .catch((error) => error);
  };

  const updateRecipeData = (obj) => {
    setRecipeData({
      ...RecipeData,
      ...obj,
    });
  };

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
                <MDTypography variant="h6" color="white">
                  Edit Recipe Information
                </MDTypography>
              </MDBox>
              <MDBox pt={4} pb={3} px={3}>
                <MDBox component="form" role="form">
                  <MDBox mb={2}>
                    <MDInput
                      onChange={(e) => {
                        updateRecipeData({ name: e.target.value });
                      }}
                      type="text"
                      label="Name"
                      variant="standard"
                      fullWidth
                      value={RecipeData.name}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      onChange={(e) => {
                        updateRecipeData({ description: e.target.value });
                      }}
                      multiline
                      type="text"
                      label="Description"
                      variant="standard"
                      fullWidth
                      value={RecipeData.description}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      onChange={(e) => {
                        updateRecipeData({ youtube_video: e.target.value });
                      }}
                      type="text"
                      label="youtube video Link"
                      variant="standard"
                      fullWidth
                      value={RecipeData.youtube_video}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <Box sx={{ minWidth: 120 }}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Category
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={RecipeData?.Categories[0]?.id ?? ""}
                          label="Category"
                          style={{ padding: "20px 0" }}
                          onChange={(e) => {
                            updateRecipeData({
                              Categories: [{ id: e.target.value }],
                            });
                          }}
                        >
                          {CategoriesData.map((category, i) => {
                            //check
                            return (
                              <MenuItem value={category.id} key={category.id}>
                                {category.name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Box>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="file"
                      label="Picture"
                      variant="standard"
                      fullWidth
                      ref={RPRef}
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      type="file"
                      label="Picture"
                      variant="standard"
                      fullWidth
                      ref={BPRef}
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={() => {
                        saveRecipe();
                      }}
                    >
                      Save Recipe
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
        title="Recipe Updeted"
        content={serverResponse}
        open={openSnackBar}
        close={closeSnackBar}
        dateTime=""
        bgWhite
      />
    </DashboardLayout>
  );
}
export default EditFile;