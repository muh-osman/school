import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
// Bootstrap
import "bootstrap/dist/css/bootstrap.min.css";
// import "bootstrap/dist/js/bootstrap.min.js";
// MUI theme
import { createTheme, ThemeProvider } from "@mui/material/styles";
import ScopedCssBaseline from "@mui/material/ScopedCssBaseline";
// MUI RTL
import rtlPlugin from "stylis-plugin-rtl";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
// Toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// React cookie
import { CookiesProvider } from "react-cookie";
// React query
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create a client
const qc = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  },
});

// Create rtl cache
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [rtlPlugin],
});

const defaultTheme = createTheme({
  direction: "rtl", // Set the direction to right-to-left
  palette: {
    primary: {
      main: "#7431fa",
    },
    // ... other colors
  },
  // ... other theme options
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <CacheProvider value={cacheRtl}>
    <ThemeProvider theme={defaultTheme}>
      <CookiesProvider>
        <QueryClientProvider client={qc}>
          <ToastContainer />
          <ScopedCssBaseline>
            <App />
          </ScopedCssBaseline>
        </QueryClientProvider>
      </CookiesProvider>
    </ThemeProvider>
  </CacheProvider>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
