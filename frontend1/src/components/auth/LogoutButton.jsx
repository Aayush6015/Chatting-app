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
      className="w-3/4 mx-auto border-2 rounded-xl text-center text-red-600 hover:bg-red-600 hover:text-black hover:font-semibold px-4 py-2   "
    >
      Logout
    </button>
  );
};

export default LogoutButton;
