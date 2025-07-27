
import { useState } from "react";
import { auth, provider } from "../../firebase/firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff } from "lucide-react";

const RegisterForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showForm, setShowForm] = useState(false);
  const [firebaseEmail, setFirebaseEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      setFirebaseEmail(user.email);
      setShowForm(true);
      toast.success("Google authentication successful!");
    } catch (error) {
      console.error(error);
      toast.error("Google Sign-In failed");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const currentUser = auth.currentUser;
      const idToken = await currentUser.getIdToken();

      const formDataToSend = new FormData();
      formDataToSend.append("email", firebaseEmail);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);

      const res = await dispatch(
        registerUser({ formData: formDataToSend, idToken })
      );

      if (registerUser.fulfilled.match(res)) {
        toast.success("Registration successful");
        navigate("/login");
      } else {
        toast.error(res.payload || "Registration failed");
      }
    } catch (err) {
      console.error(err);
      toast.error("Unexpected error during registration");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToGoogle = () => {
    setShowForm(false);
    setFirebaseEmail("");
    setFormData({ username: "", password: "" });
  };

  return (
    <div>
      {!showForm ? (
        <div className="text-center ">
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full bg-white text-black font-semibold border-2 border-white py-3 px-6 rounded-xl hover:bg-black transition-colors disabled:opacity-50 hover:text-white"
          >
            {loading ? "Connecting to Google..." : "Continue with Google"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <button
            type="button"
            onClick={handleBackToGoogle}
            className="text-sm text-blue-400 hover:underline"
          >
            Back to Google Sign-In
          </button>

          <div>
            <p className="text-l text-white font-semibold">
              Email verified: {firebaseEmail}
            </p>
          </div>

          <div>
            <label className="block text-white ml-1 font-semibold text-l mb-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter username"
              className="w-full px-4 py-3 rounded-xl bg-black text-white border-2 border-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
          </div>

          <div>
            <label className="block text-white text-l ml-1 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl bg-black text-white border-2 border-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-white underline"
              >
                {showPassword ? <Eye size={20}/> : <EyeOff size = {20}/>}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white border-2 border-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>
      )}

      <p className="mt-6 text-sm text-white text-center">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-400 hover:underline"
        >
          Back to Login
        </Link>
      </p>
    </div>
  );
};

export default RegisterForm;
