import style from "./AddTable.module.scss";
// React
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
// MUI
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import CircularProgress from "@mui/material/CircularProgress";
// Cookies
import { useCookies } from "react-cookie";
// Api
import { useAddTebleApi } from "../../../API/useAddTebleApi";
// Toastify
import { toast } from "react-toastify";
//

// Google api credintial
const clientId = process.env.REACT_APP_CLIENT_ID;
const apiKey = process.env.REACT_APP_API_KEY;

const CLIENT_ID = clientId;
const API_KEY = apiKey;

const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES =
  "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";

export default function AddTable() {
  const [cookies, setCookie, removeCookie] = useCookies([
    "userId",
    "access_token",
    "expires_at",
  ]);

  const [addFormData, setAddFormData] = useState({
    name: "",
    description: "",
    private_link: "",
  });

  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const gapiLoaded = () => {
      window.gapi.load("client", initializeGapiClient);
    };

    const initializeGapiClient = async () => {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: DISCOVERY_DOCS,
      });
      maybeEnableButtons();
      checkExistingToken(); // Check for existing token on load
    };

    const gisLoaded = () => {
      window.tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: handleAuthCallback,
      });
      maybeEnableButtons();
    };

    const maybeEnableButtons = () => {
      if (window.gapi && window.google) {
        // document.getElementById("authorize_button").style.visibility =
        //   "visible";
      }
    };

    const checkExistingToken = () => {
      const token = cookies.access_token;
      const expiresAt = cookies.expires_at;
      const now = new Date().getTime() / 1000; // Current time in seconds

      if (token && expiresAt > now) {
        window.gapi.client.setToken({ access_token: token });
        setIsAuthorized(true);
      } else {
        // Token is expired or doesn't exist, prompt for authorization
        handleAuthClick();
      }
    };

    const handleAuthCallback = async (resp) => {
      if (resp.error) {
        throw resp;
      }
      setCookie("access_token", resp.access_token, { path: "/" }); // Store token in cookies
      // Store the expiration time
      const expiresAt = new Date().getTime() / 1000 + resp.expires_in; // Current time + expires_in
      setCookie("expires_at", expiresAt, { path: "/" }); // Store expiration time in cookies
      setIsAuthorized(true);
    };

    // Load the Google API scripts
    const script1 = document.createElement("script");
    script1.src = "https://apis.google.com/js/api.js";
    script1.async = true;
    script1.defer = true;
    script1.onload = gapiLoaded;

    const script2 = document.createElement("script");
    script2.src = "https://accounts.google.com/gsi/client";
    script2.async = true;
    script2.defer = true;
    script2.onload = gisLoaded;

    document.body.appendChild(script1);
    document.body.appendChild(script2);

    return () => {
      document.body.removeChild(script1);
      document.body.removeChild(script2);
    };
  }, []);

  // Function to check if the token is expired
  const isTokenExpired = (token) => {
    const now = new Date().getTime() / 1000; // Current time in seconds
    return token.expires_at <= now; // Check if the token's expiration time is less than or equal to now
  };

  // Define the createNewSheet function
  const createNewSheet = async () => {
    setLoading(true);

    // Check if the token is valid
    const token = window.gapi.client.getToken();
    if (!token || isTokenExpired(token)) {
      // Request a new token
      window.tokenClient.requestAccessToken({ prompt: "consent" });
      setLoading(false);
      return; // Exit the function until the new token is obtained
    }

    const resource = {
      properties: {
        title: addFormData.name,
      },
    };
    try {
      const response = await window.gapi.client.sheets.spreadsheets.create({
        resource,
      });
      const spreadsheetId = response.result.spreadsheetId;
      await setSheetPermissions(spreadsheetId); // Set permissions
      // Update state and return the new value
      const updatedAddFormData = {
        ...addFormData,
        private_link: spreadsheetId,
      };
      setAddFormData(updatedAddFormData);
      // console.log(spreadsheetId);
      return updatedAddFormData; // Return the updated state
    } catch (err) {
      console.log(`Error creating spreadsheet: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Function to set permissions for the spreadsheet
  const setSheetPermissions = async (spreadsheetId) => {
    const permissionResource = {
      role: "writer",
      type: "anyone",
    };
    try {
      const response = await window.gapi.client.drive.permissions.create({
        fileId: spreadsheetId,
        resource: permissionResource,
        fields: "id", // Request the ID of the created permission
      });
      console.log("Permission ID:", response.result.id); // Log the permission ID
    } catch (err) {
      console.error(`Error setting permissions: ${err.message}`); // Log the error message
    }
  };

  // Define the handleAuthClick function
  const handleAuthClick = () => {
    if (window.gapi.client.getToken() === null) {
      window.tokenClient.requestAccessToken({ prompt: "consent" });
    } else {
      window.tokenClient.requestAccessToken({ prompt: "" });
    }
  };

  // Define the handleSignoutClick function
  const handleSignoutClick = () => {
    const token = window.gapi.client.getToken();
    if (token) {
      window.google.accounts.oauth2.revoke(token.access_token);
      window.gapi.client.setToken("");
      removeCookie("access_token"); // Remove token from storage
      removeCookie("expires_at"); // Remove expiration time from storage
      // setContent("");
      setIsAuthorized(false);
    }
  };

  // Cookie
  const [spinerTimer, setSpinerTimer] = useState(true);

  const addFormRef = useRef();

  const { mutate, data, isPending, isSuccess } = useAddTebleApi();

  const navigate = useNavigate();

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setSpinerTimer(false);
    }, 6000);

    return () => {
      clearTimeout(timeOut);
    };
  }, []);

  useEffect(() => {
    if (isSuccess) {
      // Reset the form after successful submission
      addFormRef.current.reset();
      setAddFormData({
        name: "",
        description: "",
        private_link: "",
      });

      toast.success("Created successfully");
      navigate(`/dashboard/edit-table/${data.id}`, { replace: true });
    }
  }, [isSuccess]);

  const handleInputChange = (e) => {
    setAddFormData({
      ...addFormData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validate = addFormRef.current.reportValidity();
    if (!validate) return;

    const updatedAddFormData = await createNewSheet(); // Get the updated state

    // console.log(updatedAddFormData);

    const formData = new FormData();
    Object.keys(updatedAddFormData).forEach((key) => {
      formData.append(key, updatedAddFormData[key]);
    });

    const userId = cookies.userId;
    formData.append("user_id", userId);

    mutate(formData);
  };

  return (
    <div className={style.container}>
      <Box
        ref={addFormRef}
        component="form"
        noValidate
        onSubmit={handleSubmit}
        sx={{ m: "auto", mt: 3, maxWidth: "700px" }}
      >
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="اسم الجدول"
              type="text"
              name="name"
              required
              disabled={isPending || loading}
              value={addFormData.name}
              onChange={handleInputChange}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="الوصف"
              type="text"
              name="description"
              required
              disabled={isPending || loading}
              value={addFormData.description}
              onChange={handleInputChange}
              dir="rtl"
              multiline
              rows={3}
              sx={{ backgroundColor: "#fff" }}
            />
          </Grid>
        </Grid>

        <LoadingButton
          type="submit"
          fullWidth
          variant="contained"
          disableRipple
          loading={isPending || loading}
          sx={{ mt: 3, mb: 2, transition: "0.1s" }}
        >
          حفظ
        </LoadingButton>
      </Box>
      {/* Google button overlay */}

      <div
        className={style.overlay}
        style={{
          top: isAuthorized ? "-100vh" : "0",
        }}
      >
        {spinerTimer ? (
          <Box sx={{ display: "flex" }} className={style.spiner}>
            <CircularProgress />
          </Box>
        ) : (
          <div>
            <button id="authorize_button" onClick={handleAuthClick}>
              <span>المواصلة باستخدام</span>

              <div>
                <svg
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 48 48"
                  className="LgbsSe-Bz112c"
                >
                  <g>
                    <path
                      fill="#EA4335"
                      d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                    />
                    <path
                      fill="#4285F4"
                      d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                    />
                    <path
                      fill="#34A853"
                      d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                    />
                    <path fill="none" d="M0 0h48v48H0z" />
                  </g>
                </svg>
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
