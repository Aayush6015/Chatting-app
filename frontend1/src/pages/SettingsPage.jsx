

import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const SettingsPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
    return <p className="p-4">Loading user...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white relative ">
      {/* Back button */}
      <Link
        to="/"
        className="absolute top-6 left-6 flex items-center text-white hover:underline"
      >
        <ArrowLeft className="w-10 h-10 p-2 border-2 rounded-full mr-1" />
        
      </Link>

      <div className="bg-black border  border-white shadow rounded-xl p-6 w-full max-w-md ">
        <h2 className="text-2xl text-center font-semibold mb-9">Your Profile</h2>

        <div className="flex items-center justify-evenly gap-4 mb-8">
          <img
            src={user.profilePicture || "/default-avatar.jpg"}
            alt="Profile"
            className="w-23 h-23 border-2 border-white transition-colors hover:border-blue-400  rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-medium">{user.username}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => navigate("/update-profile")}
          className="w-full rounded-xl font-semibold border-2  border-white  bg-white text-black py-2 transition hover:bg-black hover:text-white hover:border-2 hover:border-white"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
