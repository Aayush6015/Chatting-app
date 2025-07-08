import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store } from "./redux/store.js";
import { Provider } from "react-redux";
// import { ChakraProvider } from "@chakra-ui/react";
// import { ColorModeScript} from "@chakra-ui/color-mode";
// console.log("Firebase API Key:", import.meta.env.VITE_FIREBASE_API_KEY);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      {/* <ChakraProvider> */}
        {/* <ColorModeScript /> */}
        <App />
      {/* </ChakraProvider> */}
    </Provider>
  </StrictMode>
);
