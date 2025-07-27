
import axios from "axios";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react"; // ✅ optional icon
import { useState } from "react";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const res = await axios.post(
        "http://localhost:3000/api/v1/users/forgot-password",
        { email },
        { withCredentials: true }
      );
      setMessage(res.data.message || "Reset link sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black relative">
      {/* Back button */}
      <Link
        to="/login"
        className="absolute top-6 left-6 flex items-center text-white hover:underline "
      >
        <ArrowLeft className="w-10 h-10 mr-1 p-2 border-2 rounded-full" />
      
      </Link>

      <div className="w-full max-w-md p-8 bg-black text-white rounded-2xl shadow-lg border-white border-2">
        <h2 className="text-2xl font-bold mb-6 text-center">Forgot Password</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            placeholder="Enter your registered email"
            className="w-full px-4 py-3 rounded-xl bg-black border-2 border-white focus:outline-none focus:ring-2 focus:ring-white placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-white text-black font-semibold py-3 rounded-xl hover:bg-gray-200 transition-colors"
          >
            Send Reset Link
          </button>
        </form>
        {message && (
          <p className="mt-4 text-sm text-gray-300 text-center">{message}</p>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
