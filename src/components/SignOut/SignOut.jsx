import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../../auth/auth.service";
import { useUserStorage } from "../../stores/useUserStorage";

export default function SignOutButton() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { setUser } = useUserStorage();

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();

      setUser(null);

      navigate("/signin");
    } catch (err) {
      console.error("Error signing out:", err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className={`px-4 py-2 rounded-md font-semibold text-white ${
        loading ? "bg-gray-400" : "bg-red-600 hover:bg-red-500"
      }`}
    >
      {loading ? "Signing out..." : "Sign Out"}
    </button>
  );
}
