import React from "react";
import { HeaderProps } from "../../../types/pos";

export const Header: React.FC<HeaderProps> = ({ username, onLogout }) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center gap-4">
        <h1 className="text-xl font-bold text-gray-800">🛒 Cashier POS</h1>
        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
          {username}
        </span>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Live
        </span>
      </div>
      <button
        onClick={onLogout}
        className="text-white bg-red-600 font-medium text-sm p-2 rounded-sm cursor-pointer pl-4 pr-4 transition-all ease-in-out duration-200 hover:bg-red-800"
      >
        Logout
      </button>
    </div>
  );
};