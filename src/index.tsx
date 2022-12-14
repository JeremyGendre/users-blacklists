import React from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.css';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import UserContextProvider from "./context/UserContext";
import {BrowserRouter} from "react-router-dom";
import SnackbarContextProvider from "./context/SnackbackContext";
import {ThemeProvider} from "@mui/material";
import {theme} from "./utils/theme";

const root = createRoot(document.getElementById('root')!);

root.render(
  <React.StrictMode>
      <ThemeProvider theme={theme}>
          <UserContextProvider>
              <SnackbarContextProvider>
                  <BrowserRouter>
                      <App />
                  </BrowserRouter>
              </SnackbarContextProvider>
          </UserContextProvider>
      </ThemeProvider>
  </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
