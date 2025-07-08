// src/components/auth/LogoutButton.jsx
import React from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="text-red-500 hover:text-red-700 px-4 py-2 rounded w-full text-left"
    >
      Logout
    </button>
  );
};

export default LogoutButton;
