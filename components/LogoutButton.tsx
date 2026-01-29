"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    router.push("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-3 py-1.5 text-sm text-gray-600 hover:text-red-600 font-medium flex items-center gap-1.5 rounded-lg hover:bg-red-50 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>
  );
}
