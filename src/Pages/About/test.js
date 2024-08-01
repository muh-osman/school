import React, { useEffect, useState } from "react";

const CLIENT_ID =
  "620639308450-961345nhugc44d051nmobqnij0f5s05k.apps.googleusercontent.com";
const API_KEY = "AIzaSyAojW5tsIUDKWBfneZSXIove4B_l87_e6w";
const DISCOVERY_DOC =
  "https://sheets.googleapis.com/$discovery/rest?version=v4";
const SCOPES = "https://www.googleapis.com/auth/spreadsheets";

const GoogleSheets = () => {
  const [content, setContent] = useState([]);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [sheetTitle, setSheetTitle] = useState("");
  const [sheetDescreption, setSheetDescreption] = useState("");

  useEffect(() => {
    const gapiLoaded = () => {
      window.gapi.load("client", initializeGapiClient);
    };

    const initializeGapiClient = async () => {
      await window.gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
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
      if (token) {
        window.gapi.client.setToken({ access_token: token });
        setIsAuthorized(true);
        listMajors(); // Optionally fetch data immediately
      }
    };

    const handleAuthCallback = async (resp) => {
      if (resp.error) {
        throw resp;
      }
      localStorage.setItem("access_token", resp.access_token); // Store token
      setIsAuthorized(true);
      await listMajors();
    };

    const listMajors = async () => {
      let response;
      try {
        response = await window.gapi.client.sheets.spreadsheets.values.get({
          spreadsheetId: "1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms",
          range: "Class Data!A2:E",
        });
      } catch (err) {
        console.log(err);
        return;
      }
      const range = response.result;
      if (!range || !range.values || range.values.length === 0) {
        console.log("No values found.");
        return;
      }
      const output = range.values.reduce(
        (str, row) => `${str}${row[0]}, ${row[4]}\n`,
        "Name, Major:\n"
      );
      setContent(output);
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

      {/* {isAuthorized && (
        <button id="signout_button" onClick={handleSignoutClick}>
          Sign Out
        </button>
      )} */}

      <pre id="content" style={{ whiteSpace: "pre-wrap" }}>
        {content}
      </pre>

    </div>
  );
};

export default GoogleSheets;
