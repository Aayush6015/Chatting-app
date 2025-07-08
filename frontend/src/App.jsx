import React from "react";
import ToastProvider from "./components/common/ToastNotifications";
import ChatAppLayout from "./components/layout/ChatAppLayout";
import SocketEvents from "./components/socketEvents";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes.jsx"; // ✅ Missing import

const App = () => {
  return (
    <Router>
      <ToastProvider />
      <SocketEvents />
      <AppRoutes />
    </Router>
  );
};

export default App;
