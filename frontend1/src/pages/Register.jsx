import React, { useEffect } from "react";
import RegisterForm from "../components/auth/RegisterForm.jsx"
import { useNavigate } from "react-router-dom";

const Register = () => {
  // const navigate = useNavigate();

  // useEffect(() => {
  //   const googleToken = localStorage.getItem("googleToken");
  //   if (!googleToken) {
  //     navigate("/login");
  //   }
  // }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          Complete Registration
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;