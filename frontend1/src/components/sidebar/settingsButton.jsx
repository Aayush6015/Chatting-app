import { useNavigate } from "react-router-dom";
import { Settings } from "lucide-react";

const SettingsButton = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/settings")}
      className="w-3/4 mx-auto border-2 border-white justify-center rounded-xl cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-white hover:text-black text-center"
    >
      <Settings className="w-5 h-5" />
      <span className="text-sm text-center font-medium">Settings</span>
    </button>
  );
};

export default SettingsButton;
