import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const user  = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  if (!user) {
    return <p className="p-4">Loading user...</p>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      <div className="bg-white dark:bg-gray-800 shadow rounded p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Your Profile</h2>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={user.profilePicture || "/default-avatar.jpg"}
            alt="Profile"
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <p className="text-lg font-medium">{user.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.email}
            </p>
          </div>
        </div>

        <button
          onClick={() => navigate("/update-profile")} // implement later
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition"
        >
          Update Profile
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
