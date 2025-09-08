import { UserCircle2, LogOut } from "lucide-react";

const Topbar = () => {
  return (
    <header className="w-full h-16 bg-white shadow-md flex items-center justify-between px-6 border-b border-gray-200 z-30 md:fixed md:top-0 md:left-[16rem] md:ml-[2px] md:w-[calc(100%-16rem-2px)]">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
        <UserCircle2 className="w-6 h-6 text-rose-600" />
        <span className="hidden sm:inline">Admin Dashboard</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-sm font-medium text-gray-600 hidden md:block">
          Welcome, Admin
        </div>
        <button className="flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl text-sm font-semibold transition-colors duration-200 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-rose-500">
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Topbar;
