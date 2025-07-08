// components/common/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import LoginForm from "../components/auth/LoginForm";
import RegisterForm from "../components/auth/RegisterForm";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";
import ResetPasswordForm from "../components/auth/ResetPasswordForm";
import ChatAppLayout from "../components/layout/ChatAppLayout";
import ProtectedRoute from "../components/common/ProtectedRoute.jsx";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginForm />} />
      <Route path="/register" element={<RegisterForm />} />
      <Route path="/forgot-password" element={<ForgotPasswordForm />} />
      <Route path="/reset-password/:token" element={<ResetPasswordForm />} />

      {/* Protected Chat Route */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatAppLayout />
          </ProtectedRoute>
        }
      />

      {/* Redirect unknown routes to /login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
};

export default AppRoutes;
