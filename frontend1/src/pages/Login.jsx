

import React, { useEffect, useState } from "react";
import LoginForm from "../components/auth/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.auth);

  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/chat");
    }
  }, [user, navigate]);

  const handleLogin = async (formData) => {
    await dispatch(loginUser(formData));
  };

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const containerBg = isDarkMode ? "bg-black text-white" : "bg-white text-black";
  const cardBg = isDarkMode ? "bg-black" : "bg-white";
  const toggleBtnBg = isDarkMode ? "bg-white text-black" : "bg-black text-white";
  const linkColor = isDarkMode ? "text-white" : "text-black";

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${containerBg}`}
    >
      <button
        onClick={toggleTheme}
        aria-label="Toggle theme"
        className={`absolute top-6 right-6 p-2 rounded-full border ${toggleBtnBg} transition-colors duration-300`}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      <div className={`p-8 rounded-lg border w-full max-w-md ${cardBg}`}>
        <h2 className="text-3xl font-bold mb-8 text-center">Login</h2>
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        <Link
          to="/forgot-password"
          className={`mt-6 block text-center underline font-bold ${linkColor} transition`}
        >
          Forgot Password?
        </Link>
        {/* <div className="mt-6 block text-center  font-bold transition">Don't have an account</div> */}
        <Link
          to="/register"
          className={`mt-6 block text-center underline font-bold ${linkColor} transition`}
        >
          Create Account
        </Link>
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
