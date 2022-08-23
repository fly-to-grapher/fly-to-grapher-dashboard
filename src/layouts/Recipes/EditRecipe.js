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

function EditRecipe() {
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
export default EditRecipe;

// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";
// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";
// import MDBox from "components/MDBox";
// import MDSnackbar from "components/MDSnackbar";
// import MDInput from "components/MDInput";
// import MDButton from "components/MDButton";
// import axios from "axios";

// import { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "context/AuthContext";
// import { useParams } from "react-router-dom";

// function EditRecipe() {
//   const { id } = useParams();
//   const ctx = useContext(AuthContext);
//   let [recipe, setRecipe] = useState();

//   const [openSnackBar, setOpenSnackBar] = useState(false);
//   const [serverResponse, setServerResponse] = useState("");
//   const [snackBarType, setSnackBarType] = useState("success");

//   const [RecipeData, setCategoryData] = useState({ title: "" });

//   const closeSnackBar = () => setOpenSnackBar(false);

//   const nameRef = useRef(null);
//   const desRef = useRef(null);
//   const rPRef = useRef(null);
//   const bPRef = useRef(null);
//   const yVRef = useRef(null);

//   const name = nameRef.current.querySelector("input[type=text]").value;
//   const description = desRef.current.querySelector("input[type=text]").value;

//   const youtube_video = yVRef.current.querySelector("input[type=text]").value;

//   const recipe_photo = rPRef.current.querySelector("input[type=file]").files;
//   const background_photo = bPRef.current.querySelector("input[type=file]").files;

// var formdata = new FormData();

//         formdata.append("name", name);
//         formdata.append("description", description);
//         formdata.append("recipe_photo", recipe_photo[0]);
//         formdata.append("background_photo", background_photo[0]);
//         formdata.append("youtube_video", youtube_video);
//         console.log(formdata)

//   // useEffect(() => {
//   //             fetch(`${process.env.REACT_APP_API_URL}recipes/${id}`)
//   //                 .then(response => {
//   //                     response.json().then(currentCategory => {
//   //                         setCategoryData(currentCategory.data)
//   //                     })
//   //                 })
//   //                 .catch(e => e)
//   //         }, [])

//   const updateRecipe = async () => {
//     const data = await axios({
//       url: `${process.env.REACT_APP_API_URL}recipes/${id}`,
//       headers: { Authorization: "Bearer " + ctx.token },
//     //   data: JSON.stringify({
//     // //   name,
//     // //   description,
//     // //   youtube_video,
//     // //   recipe_photo,
//     // //   background_photo

//     //   }),
//     body: formdata,
//       method: "PUT",
//     });
//     console.log(data, "----------");
//     setRecipe(data);
//     return data;
//   };

//   useEffect(() => {
//     fetchRecById();
//     updateRecipe()
//   }, []);

//   const fetchRecById = async () => {
//     const data = await axios({
//       url: `${process.env.REACT_APP_API_URL}recipes/${id}`,
//       headers: { Authorization: "Bearer " + ctx.token },
//       method: "GET",
//     });
//     console.log(data, "----------");
//     setRecipe(data);
//     return data;
//   };

//   useEffect(() => {
//     fetchRecById();
//   }, []);

//   return (

//     <DashboardLayout>
//       <DashboardNavbar />
//       <MDBox pt={6} pb={3}>
//         <Grid container spacing={6}>
//           <Grid item xs={12}>
//             <Card>
//               <MDBox pt={4} pb={3} px={3}>
//                 <MDBox component="form" role="form">
//                   <MDBox mb={2}>
//                     <MDInput
//                       ref={nameRef}
//                       type="text"
//                       label="name"
//                       variant="standard"
//                       fullWidth
//                     />
//                   </MDBox>
//                   {/* <MDBox mb={2}>
//                                                     <MDInput ref={URef} type="text" label="name" variant="standard" fullWidth />
//                                                 </MDBox>
//                                                 <MDBox mb={2}>
//                                                     <MDInput ref={CRef} type="text" label="name" variant="standard" fullWidth />
//                                                 </MDBox> */}
//                   <MDBox mb={2}>
//                     <MDInput
//                       ref={desRef}
//                       type="text"
//                       label="description"
//                       variant="standard"
//                       fullWidth
//                     />
//                   </MDBox>

//                   <MDBox mb={2}>
//                     <p>recipe_photo</p>
//                     <MDInput
//                       ref={rPRef}
//                       type="file"
//                       variant="standard"
//                       fullWidth
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <p>background_photo</p>
//                     <MDInput
//                       ref={bPRef}
//                       type="file"
//                       variant="standard"
//                       fullWidth
//                     />
//                   </MDBox>
//                   <MDBox mb={2}>
//                     <MDInput
//                       ref={yVRef}
//                       type="text"
//                       label="video link"
//                       variant="standard"
//                       fullWidth
//                     />
//                   </MDBox>
//                   {/* <MDBox mb={2}>
//                                                     <Box sx={{ minWidth: 120 }}>
//                                                         <FormControl fullWidth>
//                                                             <InputLabel id="demo-simple-select-label">Category</InputLabel>
//                                                             <Select
//                                                                 labelId="demo-simple-select-label"
//                                                                 id="demo-simple-select"
//                                                                 value={''}
//                                                                 label="Category"
//                                                                 style={{padding: '20px 0'}}
//                                                                 onChange={(e) => {updateuserData({Category: {id: e.target.value}})}}
//                                                             >
//                                                                 {categoriesData.map((category, i) => {
//                                                                     return <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
//                                                                 })}
//                                                             </Select>
//                                                         </FormControl>
//                                                     </Box>
//                                                 </MDBox> */}
//                    <MDBox mt={4} mb={1}>
//                     <MDButton
//                       variant="gradient"
//                       color="info"
//                       fullWidth
//                       onClick={EditRecipe}
//                     >
//                       edit Recipe
//                     </MDButton>
//                   </MDBox>
//                 </MDBox>
//               </MDBox>
//             </Card>
//           </Grid>
//         </Grid>
//       </MDBox>

//       <MDSnackbar
//         color={snackBarType}
//         icon={snackBarType == "success" ? "check" : "warning"}
//         title="Places App"
//         content={serverResponse}
//         open={openSnackBar}
//         // onClose={closeSnackBar}
//         close={closeSnackBar}
//         dateTime=""
//         bgWhite
//       />

//     </DashboardLayout>

//   );
// }
// export default EditRecipe;

// import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
// import DashboardNavbar from "examples/Navbars/DashboardNavbar";

// import Grid from "@mui/material/Grid";
// import Card from "@mui/material/Card";

// import MDBox from "components/MDBox";

// import MDSnackbar from "components/MDSnackbar";

// import MDInput from "components/MDInput";
// import MDButton from "components/MDButton";

// import { useContext, useEffect, useRef, useState } from "react";
// import { AuthContext } from "context/AuthContext";

// import { useParams } from "react-router-dom";

// function EditRecipe() {

//     const { id } = useParams()
//     const ctx = useContext(AuthContext)

//     const [openSnackBar, setOpenSnackBar] = useState(false)
//     const [serverResponse, setServerResponse] = useState('')
//     const [snackBarType, setSnackBarType] = useState('success')

//     const [RecipeData, setCategoryData] = useState({title: ''})

//     const closeSnackBar = () => setOpenSnackBar(false);

//     const nameRef = useRef(null)
//     const desRef = useRef(null)
//     const rPRef = useRef(null)
//     const bPRef = useRef(null)
//     const yVRef = useRef(null)

//     useEffect(() => {
//         fetch(`${process.env.REACT_APP_API_URL}recipes/${id}`)
//             .then(response => {
//                 response.json().then(currentCategory => {
//                     setCategoryData(currentCategory.data)
//                 })
//             })
//             .catch(e => e)
//     }, [])

//     const EditRecipe = () => {
//         const name = nameRef.current.querySelector('input[type=text]').value
//         const description = desRef.current.querySelector('input[type=text]').value
//         // const user_id = URef.current.querySelector('input[type=text]').value
//         // const categories = CRef.current.querySelector('input[type=text]').value
//         const video = yVRef.current.querySelector('input[type=text]').value
//         // const category_id = userCatIDRef.current.querySelector('input[type=text]').value

//         const pictureR =rPRef.current.querySelector('input[type=file]').files
//         console.log(pictureR)
//         const pictureB = bPRef.current.querySelector('input[type=file]').files
//         console.log(pictureB)

//         var formdata = new FormData();
//         formdata.append("name", name);
//         // formdata.append("user_id", user_id);
//         // formdata.append("categories", categories);
//         formdata.append("description", description);
//         // formdata.append("category_id", category_id);
//         formdata.append("recipe_photo", pictureR[0]);
//         formdata.append("background_photo", pictureB[0]);
//         formdata.append("youtube_video", video);
//         console.log(formdata)

//         fetch(`${process.env.REACT_APP_API_URL}recipes/edit${id}`, {
//             method: 'put',
//             body: formdata,
//             headers: {
//                 'Authorization': 'Bearer ' + ctx.token
//             }
//         }).then(response => {
//             response.json().then(categoryEdited => {
//                 setServerResponse(categoryEdited.messages.join(' '))
//                 if (categoryEdited.success) {
//                     setCategoryData(categoryEdited.data)
//                     setSnackBarType('success')
//                 } else {
//                     setSnackBarType('error')
//                 }
//                 setOpenSnackBar(true)
//             })
//         }).catch(e => e)
//     }

//     return (
//         <DashboardLayout>
//             <DashboardNavbar />
//             <MDBox pt={6} pb={3}>
//                 <Grid container spacing={6}>
//                     <Grid item xs={12}>
//                         <Card>
//                             <MDBox pt={4} pb={3} px={3}>
//                                 <MDBox component="form" role="form">
//                                     <MDBox mb={2}>
//                                         <MDInput ref={nameRef} type="text" label="name" variant="standard" fullWidth />
//                                     </MDBox>
//                                     {/* <MDBox mb={2}>
//                                         <MDInput ref={URef} type="text" label="name" variant="standard" fullWidth />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput ref={CRef} type="text" label="name" variant="standard" fullWidth />
//                                     </MDBox> */}
//                                     <MDBox mb={2}>
//                                         <MDInput ref={desRef} type="text" label="description" variant="standard" fullWidth />
//                                     </MDBox>

//                                     <MDBox mb={2}>
//                                     <p>recipe_photo</p>
//                                         <MDInput ref={rPRef} type="file"  variant="standard" fullWidth />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                     <p>background_photo</p>
//                                         <MDInput ref={bPRef} type="file" variant="standard" fullWidth />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput ref={yVRef} type="text" label="video link" variant="standard" fullWidth />
//                                     </MDBox>
//                                     {/* <MDBox mb={2}>
//                                         <Box sx={{ minWidth: 120 }}>
//                                             <FormControl fullWidth>
//                                                 <InputLabel id="demo-simple-select-label">Category</InputLabel>
//                                                 <Select
//                                                     labelId="demo-simple-select-label"
//                                                     id="demo-simple-select"
//                                                     value={''}
//                                                     label="Category"
//                                                     style={{padding: '20px 0'}}
//                                                     onChange={(e) => {updateuserData({Category: {id: e.target.value}})}}
//                                                 >
//                                                     {categoriesData.map((category, i) => {
//                                                         return <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
//                                                     })}
//                                                 </Select>
//                                             </FormControl>
//                                         </Box>
//                                     </MDBox> */}
//                                     <MDBox mt={4} mb={1}>
//                                         <MDButton variant="gradient" color="info" fullWidth onClick={EditRecipe}>
//                                         edit Recipe
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
//                 title="Places App"
//                 content={serverResponse}
//                 open={openSnackBar}
//                 // onClose={closeSnackBar}
//                 close={closeSnackBar}
//                 dateTime=""
//                 bgWhite
//             />

//         </DashboardLayout>
//     )
// }

// export default EditRecipe

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

// import { Wrapper } from "@googlemaps/react-wrapper";
// import { useParams } from "react-router-dom";
// function Map({ center, zoom, prevState, updatePlace }) {
//     const mapRef = useRef(null)
//     const [map, setMap] = useState()
//     useEffect(() => {
//         setMap(new window.google.maps.Map(mapRef.current, {
//             center,
//             zoom,
//         }));
//     }, []);
//     useEffect(() => {
//         if (map) {
//             map.addListener("click", (mapsMouseEvent) => {
//                 const coordinates = mapsMouseEvent.latLng.toJSON()
//                 updatePlace({
//                     ...prevState,
//                     latitude: coordinates.lat,
//                     longitude: coordinates.lng
//                 })
//             });
//         }
//     }, [map])
//     return (<div ref={mapRef} style={{ height: '400px' }} />)
// }
// function Edituser() {
//     const [longitude, setLongitude] = useState(28.5)
//     const [latitude, setLatitude] = useState(40.5)
//     const [category, setCategory] = useState(0)

//     const userPicRef = useRef(null)

//     const [userData, setuserData] = useState({
//         name: '',
//         description: '',
//         longitude: 28,
//         latitude: 41,
//         Category: {
//             id: null
//         }
//     })
//     const { id } = useParams()
//     useEffect(() => {
//         fetch(`${process.env.REACT_APP_API_URL}recipes/${id}`)
//             .then(response => {
//                 response.json().then(currentPlace => {
//                     setuserData(currentPlace.data)
//                 })
//             })
//             .catch(e => e)
//     }, [])

//     const ctx = useContext(AuthContext)

//     const [serverResponse, setServerResponse] = useState(" ")
//     const [snackBarType, setSnackBarType] = useState("success")
//     const [openSnackBar, setOpenSnackBar] = useState(false)

//     const closeSnackBar = () => setOpenSnackBar(false);

//     const [categoriesData, setCategoriesData] = useState([])
//     useEffect(() => {
//         fetch(`${process.env.REACT_APP_API_URL}categories`)
//             .then(response => {
//                 response.json().then(categories => {
//                     setCategoriesData(categories.data)
//                 })
//             })
//     }, [])
//     const saveuser = () => {
//         const picture = userPicRef.current.querySelector('input[type=file]').files
//         var formdata = new FormData();
//         formdata.append("name", name);
//         // formdata.append("user_id", user_id);
//         // formdata.append("categories", categories);
//         formdata.append("description", description);
//         // formdata.append("category_id", category_id);
//         formdata.append("recipe_photo", pictureR[0]);
//         formdata.append("background_photo", pictureB[0]);
//         formdata.append("youtube_video", video);
//         console.log(formdata)
//         fetch(`${process.env.REACT_APP_API_URL}user/${id}`, {
//             method: 'PUT',
//             headers: {
//                 'Authorization': 'Bearer ' + ctx.token
//             },
//             body: formdata,
//         }).then(response => response.json())
//             .then(result => {
//                 console.log(result)
//                 setServerResponse(result.message.join(' '))
//                 if (result.success) {
//                     setSnackBarType('success')
//                 } else {
//                     setSnackBarType('error')
//                 }
//                 setOpenSnackBar(true)
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//     }

//     const updateuserData = (obj) => {
//         setuserData({
//             ...userData,
//             ...obj
//         })
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
//                                     Edit user
//                                 </MDTypography>
//                             </MDBox>
//                             <MDBox pt={4} pb={3} px={3}>
//                                 <MDBox component="form" role="form">
//                                     <MDBox mb={2}>
//                                         <MDInput onChange={(e) => {updateuserData({name: e.target.value})}} type="text" label="user name" variant="standard" fullWidth value={userData.name} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput onChange={(e) => {updateuserData({description: e.target.value})}} type="text" label="user Description" variant="standard" fullWidth value={userData.description} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput onChange={(e) => {updateuserData({latitude: e.target.value})}} type="text" label="Latitude" variant="standard" fullWidth value={userData.latitude} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput onChange={(e) => {updateuserData({longitude: e.target.value})}} type="text" label="longitude" variant="standard" fullWidth value={userData.longitude} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <Box sx={{ minWidth: 120 }}>
//                                             <FormControl fullWidth>
//                                                 <InputLabel id="demo-simple-select-label">Category</InputLabel>
//                                                 <Select
//                                                     labelId="demo-simple-select-label"
//                                                     id="demo-simple-select"
//                                                     value={userData?.Category?.id ?? ''}
//                                                     label="Category"
//                                                     style={{padding: '20px 0'}}
//                                                     onChange={(e) => {updateuserData({Category: {id: e.target.value}})}}
//                                                 >
//                                                     {categoriesData.map((category, i) => {
//                                                         return <MenuItem value={category.id} key={category.id}>{category.name}</MenuItem>
//                                                     })}
//                                                 </Select>
//                                             </FormControl>
//                                         </Box>
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <MDInput type="file" label="Picture" variant="standard" fullWidth ref={userPicRef} />
//                                     </MDBox>
//                                     <MDBox mb={2}>
//                                         <Wrapper apiKey={''} >
//                                             <Map center={{ lat: userData.latitude, lng: userData.longitude }} zoom={16} updateuser={setuserData} prevState={userData} />
//                                         </Wrapper>
//                                     </MDBox>
//                                     <MDBox mt={4} mb={1}>
//                                         <MDButton variant="gradient" color="info" fullWidth onClick={saveuser}>
//                                             Save user
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
//                 title="user App"
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
// export default Edituser
