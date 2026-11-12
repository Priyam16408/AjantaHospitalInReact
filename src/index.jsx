import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "@app/App";
import store from "@store/store";
import "./utils/i18n";
import "./index.css";
import "@app/assets/css/theme.css";
import * as serviceWorker from "./serviceWorker";
import { BrowserRouter } from "react-router-dom";
import ReactGA from "react-ga4";
import { PrimeReactProvider } from "primereact/api";
import "primereact/resources/themes/lara-light-cyan/theme.css";
import React from "react";
import "../node_modules/flag-icon-css/css/flag-icons.min.css"; // ✅Changes made to fig the flag icon bug(Govind)

import 'rc-easyui/dist/themes/default/easyui.css';       
import 'rc-easyui/dist/themes/icon.css';



import "primeicons/primeicons.css";
import "rc-easyui/dist/themes/default/easyui.css";
import "rc-easyui/dist/themes/icon.css";
import "rc-easyui/dist/themes/react.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "react-quill/dist/quill.snow.css";
// import "primeicons/primeicons.css";
// import "rc-easyui/dist/themes/default/easyui.css";
// import "rc-easyui/dist/themes/icon.css";
// import "rc-easyui/dist/themes/react.css";
// import "bootstrap-icons/font/bootstrap-icons.css";
// import "react-quill/dist/quill.snow.css";
const { VITE_NODE_ENV, VITE_GA_ID } = import.meta.env;

if (VITE_NODE_ENV === "production" && VITE_GA_ID) {
  ReactGA.initialize(VITE_GA_ID);
}

const container = document.getElementById("root");
const root = createRoot(container);
root.render(
  <PrimeReactProvider>
    <Provider store={store}>
      <BrowserRouter>
        <App />
        {/* <Confirmation  /> */}
      </BrowserRouter>
    </Provider>
  </PrimeReactProvider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
