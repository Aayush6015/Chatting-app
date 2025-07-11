// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../features/auth/authSlice.js";

// const Login = () => {
//   const dispatch = useDispatch();
//   const { loading, error } = useSelector((state) => state.auth);
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     dispatch(loginUser({ identifier, password }));
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-full max-w-sm"
//       >
//         <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
//         <input
//           type="text"
//           placeholder="Email/Username"
//           value={identifier}
//           onChange={(e) => setIdentifier(e.target.value)}
//           className="w-full p-2 border mb-4 rounded"
//         />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 border mb-4 rounded"
//         />
//         {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-2 rounded"
//           disabled={loading}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;


// import React, { useState } from "react";

// const LoginForm = ({ onSubmit, loading, error }) => {
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ identifier, password });
//   };

//   return (
//     <form onSubmit={handleSubmit} className="w-full max-w-sm">
//       <input
//         type="text"
//         placeholder="Email or Username"
//         value={identifier}
//         onChange={(e) => setIdentifier(e.target.value)}
//         className="w-full p-3 border text-white border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         className="w-full p-3 border text-white border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
//       />
//       {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
//       <button
//         type="submit"
//         disabled={loading}
//         className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white p-3 rounded transition"
//       >
//         {loading ? "Logging in..." : "Login"}
//       </button>
//     </form>
//   );
// };

// export default LoginForm;


import React, { useState } from "react";

const LoginForm = ({ onSubmit, loading, error }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ identifier, password });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto p-6 bg-black text-white">
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="w-full p-3 mb-4 bg-black border border-white rounded placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 mb-4 bg-black border border-white rounded placeholder-white focus:outline-none focus:ring-2 focus:ring-white"
      />
      {error && <p className="text-white text-sm mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white text-black hover:bg-black hover:text-white border border-white p-3 rounded transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;


// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser } from "../../features/auth/authSlice.js";
// import { motion } from "framer-motion";
// import { User, Lock, Loader2 } from "lucide-react"; // Import Lucide icons

// const LoginForm = ({ onSubmit, loading, error, isDarkMode }) => {
//   const [identifier, setIdentifier] = useState("");
//   const [password, setPassword] = useState("");

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     onSubmit({ identifier, password }); // Call the onSubmit prop
//   };

//   // Define colors based on theme
//   const bgColor = isDarkMode ? "bg-dark-card" : "bg-white";
//   const textColor = isDarkMode ? "text-white" : "text-gray-800";
//   const inputBorder = isDarkMode ? "border-gray-600" : "border-gray-300";
//   const inputFocus = isDarkMode ? "focus:ring-bumble-dark-yellow" : "focus:ring-bumble-yellow";
//   const buttonBg = "bg-bumble-yellow";
//   const buttonHover = "hover:bg-bumble-dark-yellow";
//   const buttonText = isDarkMode ? "text-gray-900" : "text-white"; // Button text can be dark for yellow background

//   return (
//     <motion.form
//       onSubmit={handleSubmit}
//       className={`p-8 rounded-lg shadow-xl w-full max-w-sm transition-colors duration-300 ${bgColor}`}
//       initial={{ opacity: 0, y: -20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//     >
//       <motion.h2
//         className={`text-3xl font-extrabold mb-8 text-center ${textColor}`}
//         initial={{ scale: 0.8 }}
//         animate={{ scale: 1 }}
//         transition={{ type: "spring", stiffness: 200, damping: 10 }}
//       >
//         Welcome Back!
//       </motion.h2>

//       <motion.div
//         className="relative mb-6"
//         initial={{ x: -10, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ delay: 0.2, duration: 0.4 }}
//       >
//         <User className={`absolute left-3 top-1/2 -translate-y-1/2 ${textColor}`} size={20} />
//         <input
//           type="text"
//           placeholder="Email or Username"
//           value={identifier}
//           onChange={(e) => setIdentifier(e.target.value)}
//           className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200 ${inputBorder} ${textColor} ${inputFocus} focus:border-bumble-dark-yellow border-2 bg-transparent`}
//         />
//       </motion.div>

//       <motion.div
//         className="relative mb-8"
//         initial={{ x: -10, opacity: 0 }}
//         animate={{ x: 0, opacity: 1 }}
//         transition={{ delay: 0.3, duration: 0.4 }}
//       >
//         <Lock className={`absolute left-3 top-1/2 -translate-y-1/2 ${textColor}`} size={20} />
//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className={`w-full pl-10 pr-4 py-3 rounded-lg outline-none transition-all duration-200 ${inputBorder} ${textColor} ${inputFocus} focus:border-bumble-dark-yellow border-2 bg-transparent`}
//         />
//       </motion.div>

//       {error && (
//         <motion.p
//           className="text-red-500 text-sm mb-4 text-center"
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           transition={{ duration: 0.3 }}
//         >
//           {error}
//         </motion.p>
//       )}

//       <motion.button
//         type="submit"
//         className={`w-full py-3 rounded-lg font-bold text-lg focus:outline-none focus:ring-4 focus:ring-offset-2 ${buttonBg} ${buttonText} ${buttonHover} transition-all duration-300 flex items-center justify-center ${loading ? 'cursor-not-allowed opacity-70' : 'hover:scale-105'}`}
//         disabled={loading}
//         whileTap={{ scale: 0.95 }}
//         whileHover={{ scale: 1.02 }}
//         initial={{ y: 20, opacity: 0 }}
//         animate={{ y: 0, opacity: 1 }}
//         transition={{ delay: 0.4, duration: 0.4 }}
//       >
//         {loading ? (
//           <>
//             <Loader2 className="animate-spin mr-2" size={20} /> Logging in...
//           </>
//         ) : (
//           "Login"
//         )}
//       </motion.button>
//     </motion.form>
//   );
// };

// export default LoginForm;