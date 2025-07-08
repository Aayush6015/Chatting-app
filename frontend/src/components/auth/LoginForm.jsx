// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { loginUser, loginWithGoogle } from "../../features/auth/authSlice";
// import { useNavigate, Link } from "react-router-dom";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";
// // import toast from "../common/ToastNotifications";
// import { toast } from "react-toastify";

// const LoginForm = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { user, accessToken, loading, error } = useSelector(
//     (state) => state.auth
//   );
//   console.log(user, accessToken);

//   const [formData, setFormData] = useState({
//     identifier: "",
//     password: "",
//   });

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const resultAction = dispatch(
//         loginUser({
//           identifier: formData.identifier,
//           password: formData.password,
//         })
//       );
//       console.log("login result", resultAction.payload);

//       if (loginUser.fulfilled.match(resultAction)) {
//         console.log("payload returned - ",resultAction.payload);
        
//         toast.success("Login successful!");
//         // navigate("/"); // Redirect on successful login
//       } else {
//         // Optional: catch and show message from rejected response
//         toast.error(resultAction.payload || "Login failed. Please try again.");
//       }
//     } catch (err) {
//       console.error("Login error:", err);
//       toast.error("An unexpected error occurred during login.");
//     }
//   };

//   useEffect(() => {
//     if (user && accessToken) {
//       navigate("/");
//     }
//   }, [user, accessToken, navigate]);

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Login</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           name="identifier"
//           placeholder="Email or Username"
//           value={formData.identifier}
//           onChange={handleChange}
//           required
//         />
//         <Input
//           name="password"
//           type="password"
//           placeholder="Password"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         <Button type="submit" className="w-full" disabled={loading}>
//           {loading ? <Loader2 className="animate-spin mr-2" /> : "Login"}
//         </Button>
//         {error && <p className="text-red-600 text-sm text-center">{error}</p>}
//         <div className="text-sm text-center mt-2">
//           <Link to="/forgot-password" className="text-blue-600 hover:underline">
//             Forgot Password?
//           </Link>
//         </div>
//         <div className="text-sm text-center">
//           Don’t have an account?{" "}
//           <Link to="/register" className="text-blue-600 hover:underline">
//             Register
//           </Link>
//         </div>
//       </form>
//     </div>
//   );
// };

// export default LoginForm;


import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, loginWithGoogle } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, Eye, EyeOff } from "lucide-react";
// import toast from "../common/ToastNotifications";
import { toast } from "react-toastify";

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, accessToken, loading, error } = useSelector(
    (state) => state.auth
  );
  console.log(user, accessToken);

  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = dispatch(
        loginUser({
          identifier: formData.identifier,
          password: formData.password,
        })
      );
      console.log("login result", resultAction.payload);

      if (loginUser.fulfilled.match(resultAction)) {
        console.log("payload returned - ",resultAction.payload);
        
        toast.success("Login successful!");
        // navigate("/"); // Redirect on successful login
      } else {
        // Optional: catch and show message from rejected response
        toast.error(resultAction.payload || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("Login error:", err);
      toast.error("An unexpected error occurred during login.");
    }
  };

  useEffect(() => {
    if (user && accessToken) {
      navigate("/");
    }
  }, [user, accessToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Title name
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to your account to continue
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email/Username Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 w-5 h-5" />
                <Input
                  name="identifier"
                  placeholder="Email/Username"
                  value={formData.identifier}
                  onChange={handleChange}
                  required
                  className="pl-10 w-full h-12 text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
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
                  {!showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {/* {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </p>
              </div>
            )} */}

            {/* Login Button */}
            <Button 
              type="submit" 
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]" 
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                  Signing in...
                </div>
              ) : (
                "Sign In"
              )}
            </Button>

            {/* Forgot Password Link */}
            <div className="text-center">
              <Link 
                to="/forgot-password" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium hover:underline transition-colors"
              >
                Forgot your password?
              </Link>
            </div>
          </form>
        </div>

        {/* Sign Up Link */}
        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <Link 
              to="/register" 
              className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-semibold hover:underline transition-colors"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;