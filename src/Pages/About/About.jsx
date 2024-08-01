import React, { useEffect, useState } from "react";

const CLIENT_ID =
  "620639308450-961345nhugc44d051nmobqnij0f5s05k.apps.googleusercontent.com";
const API_KEY = "AIzaSyAojW5tsIUDKWBfneZSXIove4B_l87_e6w";
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
  "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
];
const SCOPES =
  "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive";

const GoogleSheets = () => {
  const [sheetTitle, setSheetTitle] = useState("New Spreadsheet");
  const [loading, setLoading] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [content, setContent] = useState("");

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
        document.getElementById("authorize_button").style.visibility =
          "visible";
      }
    };

    const checkExistingToken = () => {
      const token = localStorage.getItem("access_token");
      const expiresAt = localStorage.getItem("expires_at");
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
      localStorage.setItem("access_token", resp.access_token); // Store token
      // Store the expiration time
      const expiresAt = new Date().getTime() / 1000 + resp.expires_in; // Current time + expires_in
      localStorage.setItem("expires_at", expiresAt); // Store expiration time
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
        title: sheetTitle,
      },
    };
    try {
      const response = await window.gapi.client.sheets.spreadsheets.create({
        resource,
      });
      const spreadsheetId = response.result.spreadsheetId;
      await setSheetPermissions(spreadsheetId); // Set permissions
      setContent(`${spreadsheetId}`);
    } catch (err) {
      setContent(`Error creating spreadsheet: ${err.message}`);
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
      localStorage.removeItem("access_token"); // Remove token from storage
      localStorage.removeItem("expires_at"); // Remove expiration time from storage
      setContent("");
      setIsAuthorized(false);
    }
  };

  return (
    <div>
      <h1>Sheets API Quickstart</h1>

      <button
        id="authorize_button"
        onClick={handleAuthClick}
        style={{ visibility: "hidden" }}
      >
        Authorize
      </button>

      {isAuthorized && (
        <>
          <button id="signout_button" onClick={handleSignoutClick}>
            Sign Out
          </button>

          <input
            type="text"
            value={sheetTitle}
            onChange={(e) => setSheetTitle(e.target.value)}
            placeholder="Enter sheet title"
          />

          <button onClick={createNewSheet} disabled={loading}>
            {loading ? "Creating..." : "Create New Google Sheet"}
          </button>
        </>
      )}

      <pre id="content" style={{ whiteSpace: "pre-wrap" }}>
        {content}
      </pre>

    </div>
  );
};

export default GoogleSheets;
