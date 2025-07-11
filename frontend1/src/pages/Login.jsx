// // // src/pages/Login.jsx
// import React, { useEffect } from "react";
// import LoginForm from "../components/auth/LoginForm";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../features/auth/authSlice";
// import { useNavigate, Link } from "react-router-dom";
// // import { useEffect } from "react";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error } = useSelector((state) => state.auth);
//   const {user} = useSelector(state=>state.auth);
//   const state = useSelector(state=>state);
// console.log(state)
// console.log(user);
//   useEffect(() => {
//     console.log("user changed to: ",user)
//     if (user) {
//       navigate("/chat");  // Redirect when login is successful
//     }
//   }, [user, navigate]);
  
//   const handleLogin = async (formData) => {
//     const resultAction = await dispatch(loginUser(formData));
//     console.log(formData)

//     if (loginUser.fulfilled.match(resultAction)) {
//       navigate("/chat");
//     }
//     // Optional: handle error via toast, etc.
//   };

//   return (
//     <div className="flex justify-center items-center h-screen bg-gray-100">
//       <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
//         <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
//         <Link to="/forgot-password" className="text-blue-600 mt-2 text-sm hover:underline">
//         Forgot Password?
//       </Link>
//         {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;


// // src/pages/Login.jsximport React, { useEffect, useState } from "react";
// import LoginForm from "../components/auth/LoginForm";
// import { useDispatch, useSelector } from "react-redux";
// import { useState, useEffect } from "react";
// import { loginUser } from "../features/auth/authSlice";
// import { useNavigate, Link } from "react-router-dom";
// import { Sun, Moon } from "lucide-react";

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, user } = useSelector((state) => state.auth);
//   const [isDark, setIsDark] = useState(false);

//   useEffect(() => {
//     if (user) {
//       navigate("/chat");
//     }
//   }, [user, navigate]);

//   const handleLogin = async (formData) => {
//     await dispatch(loginUser(formData));
//   };

//   // Add/remove dark class on <html>
//   useEffect(() => {
//     const root = window.document.documentElement;
//     if (isDark) {
//       root.classList.add("dark");
//     } else {
//       root.classList.remove("dark");
//     }
//   }, [isDark]);

//   return (
//     <div className="relative flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
//       {/* Dark/Light toggle button in top right */}
//       <button
//         onClick={() => setIsDark(!isDark)}
//         className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:shadow-md transition"
//         aria-label="Toggle Dark Mode"
//       >
//         {isDark ? <Sun size={20} /> : <Moon size={20} />}
//       </button>


//       <div className="w-full max-w-md bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
//       <h2 className="text-3xl font-semibold mb-8 text-center text-white">Login</h2>
//         <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
//         <Link
//           to="/forgot-password"
//           className="block pt-1 text-blue-600 dark:text-blue-400 mt-4 text-sm text-right hover:underline"
//         >
//           Forgot Password?
//         </Link>
//       </div>
//     </div>
//   );
// };

// export default Login;


// import React, { useEffect, useState } from "react"; // Import useState
// import LoginForm from "../components/auth/LoginForm";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../features/auth/authSlice";
// import { useNavigate, Link } from "react-router-dom";
// import { Sun, Moon } from "lucide-react"; // Import Lucide icons for theme toggle

// const Login = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { loading, error, user } = useSelector((state) => state.auth);

//   // State to manage dark mode
//   const [isDarkMode, setIsDarkMode] = useState(false);

//   useEffect(() => {
//     if (user) {
//       navigate("/chat"); // Redirect when login is successful
//     }
//   }, [user, navigate]);

//   const handleLogin = async (formData) => {
//     await dispatch(loginUser(formData));
//   };

//   const toggleTheme = () => {
//     setIsDarkMode((prevMode) => !prevMode);
//   };

//   // Define background based on theme
//   const containerBg = isDarkMode ? "bg-dark-background" : "bg-bumble-yellow"; // Full background
//   const cardBg = isDarkMode ? "bg-dark-card" : "bg-white"; // Card background
//   const textColor = isDarkMode ? "text-white" : "text-gray-800";
//   const linkColor = isDarkMode ? "text-bumble-dark-yellow" : "text-bumble-yellow";

//   return (
//     <div
//       className={`min-h-screen flex flex-col items-center justify-center transition-colors duration-300 ${containerBg}`}
//     >
//       <button
//         onClick={toggleTheme}
//         className={`absolute top-6 right-6 p-2 rounded-full shadow-md transition-all duration-300 ${isDarkMode ? 'bg-gray-700 text-bumble-yellow hover:bg-gray-600' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
//         aria-label="Toggle theme"
//       >
//         {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
//       </button>

//       <div
//         className={`p-8 rounded-lg shadow-2xl w-full max-w-md transition-colors duration-300 ${cardBg} ${isDarkMode ? 'border border-bumble-dark-yellow' : ''}`}
//       >
//         <h2 className={`text-3xl font-extrabold mb-8 text-center ${textColor}`}>
//           Login
//         </h2>
//         <LoginForm onSubmit={handleLogin} loading={loading} error={error} isDarkMode={isDarkMode} />
//         <Link
//           to="/forgot-password"
//           className={`mt-6 block text-center font-medium ${linkColor} hover:underline transition-colors duration-200`}
//         >
//           Forgot Password?
//         </Link>
//         {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
//       </div>
//     </div>
//   );
// };

// export default Login;

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
        {error && (
          <p className="text-red-500 mt-4 text-center">{error}</p>
        )}
      </div>
    </div>
  );
};

export default Login;
