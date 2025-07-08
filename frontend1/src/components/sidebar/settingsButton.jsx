import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const SettingsButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/settings")}
      className="w-full flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 text-left"
    >
      <Settings className="w-5 h-5" />
      <span className="text-sm font-medium">Settings</span>
    </button>
  );
};

export default SettingsButton;
