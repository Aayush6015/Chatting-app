


import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const LoginForm = ({ onSubmit, loading, error }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword,setShowPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ identifier, password });
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm mx-auto p-6 bg-black text-white">
      <label className="block text-white text-l ml-1 mb-1">Email or Username</label>
      <input
        type="text"
        placeholder="Email or Username"
        value={identifier}
        onChange={(e) => setIdentifier(e.target.value)}
        className="w-full p-3 mb-4 bg-black border border-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
      />

      <label className="block text-white text-l ml-1 mb-1">Password</label>
      <div className="relative">
      <input
        type={showPassword?"text":"password"}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full p-3 mb-4 bg-black border border-white rounded-xl placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
      />
      <button
      type="button"
      onClick={()=>setShowPassword(!showPassword)}
      className="absolute right-3 top-4 text-white hover:text-blue-400"
      tabIndex={-1}>
        {showPassword? <Eye size = {20}/> : <EyeOff size={20}/>}
      </button>
      </div>
      {error && <p className="text-white text-sm mb-2">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-white font-semibold border-2 rounded-xl text-black hover:bg-black hover:text-white a border-white p-3  transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? "Logging in..." : "Login"}
      </button>
    </form>
  );
};

export default LoginForm;
