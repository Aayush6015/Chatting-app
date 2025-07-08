// import { useState } from "react";
// import { useDispatch } from "react-redux";
// import { sendResetLink } from "../../features/auth/authSlice"; // You need to define this thunk
// import { Input } from "../../components/ui/input";

// import { Button } from "@/components/ui/button";
// import { Loader2 } from "lucide-react";

// const ForgotPasswordForm = () => {
//   const dispatch = useDispatch();

//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage(null);
//     setError(null);
//     setLoading(true);

//     try {
//       const resultAction = await dispatch(sendResetLink({ email }));

//       if (sendResetLink.fulfilled.match(resultAction)) {
//         setMessage("Reset link sent to your email.");
//       } else {
//         throw new Error(resultAction.payload || "Failed to send reset link");
//       }
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-900 rounded-xl shadow">
//       <h2 className="text-2xl font-semibold mb-4 text-center">Forgot Password</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <Input
//           type="email"
//           placeholder="Enter your registered email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <Button
//           type="submit"
//           className="w-full"
//           disabled={loading}
//         >
//           {loading ? <Loader2 className="animate-spin mr-2" /> : "Send Reset Link"}
//         </Button>

//         {message && <p className="text-green-600 text-sm">{message}</p>}
//         {error && <p className="text-red-600 text-sm">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default ForgotPasswordForm;


import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendResetLink } from "../../features/auth/authSlice"; // You need to define this thunk
import { Input } from "../../components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, ArrowLeft, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ForgotPasswordForm = () => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);

    try {
      const resultAction = await dispatch(sendResetLink({ email }));
      console.log(resultAction.payload)
      if (sendResetLink.fulfilled.match(resultAction)) {
        setMessage("Reset link sent to your email.");
      } else {
        throw new Error(resultAction.payload || "Failed to send reset link");
      }
    } catch (err) {
      if(err.message!=null)
      {
        toast.error(err.message)
      }
      // setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Forgot Password
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Enter your email to reset your password
          </p>
        </div>

        {/* Reset Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm  font-medium text-gray-700 dark:text-gray-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="email"
                  placeholder="Enter your registered email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 w-full h-12 text-white border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500 rounded-lg transition-all duration-200"
                />
              </div>
            </div>

            {/* Success Message */}
            {message && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
                <p className="text-green-600 dark:text-green-400 text-sm text-center">
                  {message}
                </p>
              </div>
            )}

            {/* Error Message */}
            {/* {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
                <p className="text-red-600 dark:text-red-400 text-sm text-center">
                  {error}
                </p>
              </div>
            )} */}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="animate-spin mr-2 w-5 h-5" />
                  Sending Reset Link...
                </div>
              ) : (
                "Send Reset Link"
              )}
            </Button>

            {/* Back to Login Link */}
            <div className="text-center">
              <Link 
                to="/login" 
                className="inline-flex items-center text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm font-medium hover:underline transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Login
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

export default ForgotPasswordForm;