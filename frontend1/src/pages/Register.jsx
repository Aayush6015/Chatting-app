import React, { useEffect } from "react";
import RegisterForm from "../components/auth/RegisterForm.jsx"
import { useNavigate } from "react-router-dom";

const Register = () => {
  

  return (
    <div className="min-h-screen flex items-center justify-center  bg-black">
      <div className="w-full max-w-md p-6 bg-black rounded-lg border-2 border-white shadow-md">
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
          Complete Registration
        </h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default Register;