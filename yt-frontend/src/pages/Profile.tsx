import { useNavigate } from "react-router";
import { useProfile } from "../hooks/useProfile";
import { logout } from "../api/auth";
import { Link } from "react-router";
import UploadFile from "../components/UploadFile";

function Profile() {
  const navigate = useNavigate();

  const { data, isLoading } = useProfile();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-xl mx-auto border rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/home" className="border rounded-md px-4 py-2">
            Back
          </Link>
          <h1 className="text-2xl font-semibold">My Profile</h1>

          <button
            onClick={handleLogout}
            className="border rounded-md px-4 py-2"
          >
            Logout
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="border rounded-md p-4">
            <p className="text-sm">Name</p>

            <p className="font-medium">{data?.name || "N/A"}</p>
          </div>

          <div className="border rounded-md p-4">
            <p className="text-sm">Email</p>

            <p className="font-medium">{data?.email || "N/A"}</p>
          </div>
          <UploadFile />
        </div>
      </div>
    </div>
  );
}

export default Profile;
