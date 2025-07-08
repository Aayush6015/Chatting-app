// src/pages/Login.jsx
import React, { useEffect } from "react";
import LoginForm from "../components/auth/LoginForm";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
// import { useEffect } from "react";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);
  const {user} = useSelector(state=>state.auth);
  const state = useSelector(state=>state);
console.log(state)
console.log(user);
  useEffect(() => {
    console.log("user changed to: ",user)
    if (user) {
      navigate("/chat");  // Redirect when login is successful
    }
  }, [user, navigate]);
  
  const handleLogin = async (formData) => {
    const resultAction = await dispatch(loginUser(formData));
    console.log(formData)

    if (loginUser.fulfilled.match(resultAction)) {
      navigate("/chat");
    }
    // Optional: handle error via toast, etc.
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
        <LoginForm onSubmit={handleLogin} loading={loading} error={error} />
        <Link to="/forgot-password" className="text-blue-600 mt-2 text-sm hover:underline">
        Forgot Password?
      </Link>
        {error && <p className="text-red-500 mt-2 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default Login;
