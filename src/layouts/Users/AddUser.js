import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

import MDBox from "components/MDBox";

import MDSnackbar from "components/MDSnackbar";

import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { useNavigate } from "react-router-dom";

import { useContext, useRef, useState } from "react";
import { AuthContext } from "context/AuthContext";

function AddUser() {
  const navigate = useNavigate();
  const pRef = useRef(null);
  const ctx = useContext(AuthContext);
  const nameRef = useRef(null);
  const userNameRef = useRef(null);
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const isAdminRef = useRef(null);

  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [serverResponse, setServerResponse] = useState("");
  const [snackBarType, setSnackBarType] = useState("success");
  const [isAdmin, setIsAdmin] = useState(0);

  const closeSnackBar = () => setOpenSnackBar(false);

  const addUser = () => {
    const name = nameRef.current.querySelector("input[type=text]").value;
    const username =
      userNameRef.current.querySelector("input[type=text]").value;
    const email = emailRef.current.querySelector("input[type=email]").value;
    const password = passwordRef.current.querySelector(
      "input[type=password]"
    ).value;
    const isadmin = isAdminRef.current.value;

    fetch(`http://localhost:5000/users/add`, {
      method: "post",
      headers: {
        Authorization: "Bearer " + ctx.token,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        username,
        email,
        password,
        isadmin: isAdmin
      })
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
                      ref={nameRef}
                      type="text"
                      label="Name"
                      variant="standard"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      ref={emailRef}
                      type="email"
                      label="Email"
                      variant="standard"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      ref={userNameRef}
                      type="text"
                      label="Userame"
                      variant="standard"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mb={2}>
                    <FormControl sx={{ minWidth: "100%" }} size="medium">
                      <InputLabel id="demo-select-small">User type</InputLabel>
                      <Select
                        labelId="demo-select-small"
                        id="demo-select-small"
                        value={isAdmin}
                        label="User type"
                        ref={isAdminRef}
                        sx={{
                          p: "10px 0"
                        }}
                        onChange={(e) => setIsAdmin(e.target.value)}
                      >
                        <MenuItem value={1}>admin</MenuItem>
                        <MenuItem value={0}>user</MenuItem>
                      </Select>
                    </FormControl>
                  </MDBox>
                  <MDBox mb={2}>
                    <MDInput
                      ref={passwordRef}
                      type="password"
                      label="Password"
                      variant="standard"
                      fullWidth
                    />
                  </MDBox>
                  <MDBox mt={4} mb={1}>
                    <MDButton
                      variant="gradient"
                      color="info"
                      fullWidth
                      onClick={addUser}
                    >
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
        icon={snackBarType == "success" ? "check" : "warning"}
        title="Recipe App"
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

export default AddUser;
