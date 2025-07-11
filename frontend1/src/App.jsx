// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Chat from "./pages/Chat";
// import NotFound from "./pages/NotFound";
import { useSelector } from "react-redux";
import SettingsPage from "./pages/SettingsPage";
// import ChatLayout from "./components/chat/ChatLayout";
// import Chat from "./pages/Chat";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import UpdateProfile from "./pages/updateProfilePage";
// import { useEffect } from "react";



const App = () => {
  const user  = useSelector((state) => state.auth.user);
  console.log(user);

  return (
    <Router>
      <Routes>
        {/* Auth Routes */}
        {/* <Route path="/" element={<Login />} /> */}
        <Route path="/" element={ <Login />} />
        <Route path="/login" element={user ? <Navigate to="/chat" /> : <Login />} />
        
        <Route path="/register" element={user ? <Navigate to="/chat" /> : <Register />} />

        {/* Protected Route */}
        <Route path="/chat" element={user ? <Chat /> : <Navigate to="/login" />} />
        {/* <Route path="/chat" element={<chat /> } /> */}
        {/* <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} /> */}
        {/* <Route path="/settings" element={ <SettingsPage /> } /> */}
        <Route path="/settings" element={user ? <SettingsPage /> : <Navigate to="/login" />} />

        <Route path="/reset-password/:resetToken" element={ <ResetPasswordPage /> } />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/update-profile" element={<UpdateProfile />} />

        



        {/* 404 */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
};

export default App;
