import React, { useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const UpdateProfile = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();

  const [newUsername, setNewUsername] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      await axios.post(
        "http://localhost:3000/api/v1/users/verify-password",
        { currentPassword },
        { withCredentials: true }
      );

      if (newUsername && newUsername !== user?.username) {
        await axios.post(
          "http://localhost:3000/api/v1/users/update-username",
          { newUsername },
          { withCredentials: true }
        );
      }

      if (profilePicture) {
        const formData = new FormData();
        formData.append("profilePicture", profilePicture);

        await axios.post(
          "http://localhost:3000/api/v1/users/update-profile-picture",
          formData,
          {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
      }

      setSuccess("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify(newUsername));
      setTimeout(() => navigate("/chat"), 1000);
    } catch (err) {
      setError(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white relative">
      {/* Back button */}
      <Link
        to="/settings"
        className="absolute top-6 left-6 flex items-center text-white hover:underline"
      >
        <ArrowLeft className="w-10 h-10 border-2  p-2 rounded-full border-white mr-1" />
        
      </Link>

      <form
        onSubmit={handleUpdate}
        className="bg-black border border-white shadow-lg rounded-2xl px-8 pt-8 pb-10 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold text-center mb-8">Update Profile</h2>

        {error && (
          <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
        )}
        {success && (
          <p className="text-green-500 text-sm mb-4 text-center">{success}</p>
        )}

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white">
            New Username
          </label>
          <input
            type="text"
            className="w-full px-4 py-3 rounded-xl bg-black border-2 text-white border-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-white"
            value={newUsername}
            placeholder="Enter new username"
            onChange={(e) => setNewUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white">
            Profile Picture
          </label>
          <div className="w-full flex flex-col">
            <label className="flex items-center px-4 py-3 rounded-xl bg-black border-2 border-white cursor-pointer hover:bg-gray-900 transition-colors">
              <span className="text-gray-300 truncate w-full overflow-hidden whitespace-nowrap">
                {profilePicture ? profilePicture.name : "Choose image"}
              </span>
              <input
                type="file"
                accept="image/*"
                
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="hidden"
              />
            </label>

            {profilePicture && (
              <button
                type="button"
                onClick={() => setProfilePicture(null)}
                className="mt-2 self-end text-sm bg-white text-black font-semibold py-2 px-4 rounded-xl hover:bg-gray-200 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2 text-white">
            Current Password
          </label>
          <input
            type="password"
            className="w-full px-4 py-3 rounded-xl bg-black text-white border-2 border-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            value={currentPassword}
            placeholder="Current password"
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={loading}
            className="bg-white border-2 border-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-black hover:text-white transition-colors disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Profile"}
          </button >

            <button className="bg-white border-2 text-center border-white text-black font-semibold py-3 px-6 rounded-xl hover:bg-black hover:text-white transition-colors disabled:opacity-50">
          <Link
            to="/forgot-password"
            className=" text-blue-600 font-semibold  "
          >
            Reset password
          </Link>
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
