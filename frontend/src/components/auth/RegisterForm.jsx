// import { useState } from "react";
// import { auth, provider } from "../../firebase/firebase.js";
// import { signInWithPopup } from "firebase/auth";
// import { useDispatch } from "react-redux";
// import { registerUser } from "../../features/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// const Register = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [showForm, setShowForm] = useState(false);
//   const [firebaseEmail, setFirebaseEmail] = useState("");
//   const [formData, setFormData] = useState({
//     username: "",
//     password: "",
//   });

//   const handleGoogleSignIn = async () => {
//     try {
//       const result = await signInWithPopup(auth, provider);
//       const user = result.user;
//       setFirebaseEmail(user.email);
//       setShowForm(true);
//     } catch (error) {
//       console.error(error);
//       toast.error("Google Sign-In failed");
//     }
//   };

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await dispatch(registerUser({
//         email: firebaseEmail,
//         username: formData.username,
//         password: formData.password,
//       }));
//       if (registerUser.fulfilled.match(res)) {
//         toast.success("Registration successful");
//         navigate("/login");
//       } else {
//         toast.error(res.payload || "Registration failed");
//       }
//     } catch (err) {
//       console.error(err);
//       toast.error("Unexpected error during registration");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
//       {!showForm ? (
//         <button
//           onClick={handleGoogleSignIn}
//           className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//         >
//           Continue with Google
//         </button>
//       ) : (
//         <form onSubmit={handleSubmit} className="space-y-4 mt-4">
//           <input
//             type="text"
//             name="username"
//             placeholder="Choose a username"
//             value={formData.username}
//             onChange={handleChange}
//             required
//             className="w-full p-2 rounded border"
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Choose a password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//             className="w-full p-2 rounded border"
//           />
//           <button
//             type="submit"
//             className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
//           >
//             Finish Registration
//           </button>
//         </form>
//       )}
//     </div>
//   );
// };

// export default Register;


import { useState } from "react";
import { auth, provider } from "../../firebase/firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User, Lock, Mail, Eye, EyeOff, UserPlus, ArrowLeft } from "lucide-react";

const Register = () => {
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
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dispatch(registerUser({
        email: firebaseEmail,
        username: formData.username,
        password: formData.password,
      }));
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-green-600 to-blue-600 rounded-full mb-4">
            <UserPlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {!showForm ? "Title name" : "Complete Registration"}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {!showForm 
              ? "Create your account to get started" 
              : "Just a few more details to finish"
            }
          </p>
        </div>

        {/* Registration Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          {!showForm ? (
            /* Google Sign-In Step */
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
                  <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Sign up with Google
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
                  We'll use your Google account to create your profile securely 😊
                </p>
              </div>

              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] h-12 bg-white dark:bg-gray-700  border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex  items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full mr-2"></div>
                    Connecting to Google...
                  </div>
                ) : (
                  <div className="flex  not-only:items-center justify-center">
                    <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                    </svg>
                    Continue with Google
                  </div>
                )}
              </Button>
            </div>
          ) : (
            /* Registration Form Step */
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Back Button */}
              <button
                type="button"
                onClick={handleBackToGoogle}
                className="flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Google Sign-in
              </button>

              {/* Email Display */}
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                <div className="flex items-center">
                  <Mail className="w-5 h-5 text-green-600 dark:text-green-400 mr-2" />
                  <div>
                    <p className="text-sm font-medium text-green-800 dark:text-green-300">
                      Email verified
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">
                      {firebaseEmail}
                    </p>
                  </div>
                </div>
              </div>

              {/* Username Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="text"
                    name="username"
                    placeholder="Choose a unique username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                    className="pl-10 h-12 border-gray-300 w-full text-white dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a secure password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="pl-10 w-full text-white pr-10 h-12 border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Creating Account...
                  </div>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Sign In Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;