import { useState } from "react";
import { auth, provider } from "../../firebase/firebase.js";
import { signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { registerUser } from "../../features/auth/authSlice";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getIdToken } from "firebase/auth";

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
      console.log("this is user email id - ",user.email)
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

  // const handleSubmit = async (e) => {

  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const res = await dispatch(
  //       registerUser({
  //         email: firebaseEmail,
  //         username: formData.username,
  //         password: formData.password,
  //       })
  //     );
  //     if (registerUser.fulfilled.match(res)) {
  //       toast.success("Registration successful");
  //       navigate("/login");
  //     } else {
  //       toast.error(res.payload || "Registration failed");
  //     }
  //   } catch (err) {
  //     console.error(err);
  //     toast.error("Unexpected error during registration");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    try {

      const currentUser = auth.currentUser;
      // const idToken = await getIdToken(currentUser);
      const idToken = await currentUser.getIdToken()
      console.log("this is user id token",idToken)
      const formDataToSend = new FormData();
      formDataToSend.append("email", firebaseEmail);
      formDataToSend.append("username", formData.username);
      formDataToSend.append("password", formData.password);
      // Optional: if you want to allow user to upload profilePicture
      // formDataToSend.append("profilePicture", file);
  
      const res = await dispatch(registerUser({formData:formDataToSend,idToken}));
  
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
      <h1>{!showForm ? "Register" : "Complete Registration"}</h1>

      {!showForm ? (
        <div>
          <button onClick={handleGoogleSignIn} disabled={loading}>
            {loading ? "Connecting to Google..." : "Continue with Google"}
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <button type="button" onClick={handleBackToGoogle}>
            Back to Google Sign-in
          </button>

          <div>
            <p>Email verified: {firebaseEmail}</p>
          </div>

          <div>
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Complete Registration"}
          </button>
        </form>
      )}

      <p>
        Already have an account? <Link to="/login">Sign in</Link>
      </p>
    </div>
  );
};

export default RegisterForm;
