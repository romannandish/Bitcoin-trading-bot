"use client";
import { useState } from "react";
import Link from "next/link";
import {
  FaChartBar,
  FaSignal,
  FaClipboardList,
  FaMoneyBill,
  FaChartPie,
} from "react-icons/fa";
import {
  IoMdArrowDropleft,
  IoMdArrowDropright,
} from "react-icons/io";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white 
      ${collapsed ? "w-20" : "w-64"} 
      min-h-screen p-4 duration-300 transition-all shadow-lg flex flex-col`}
    >
      <div className="flex justify-between items-center mb-10">
        {!collapsed && (
          <h2 className="text-2xl font-semibold tracking-wide pl-1">
            📊 Dashboard
          </h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="text-white hover:scale-105 transition"
        >
          {collapsed ? (
            <IoMdArrowDropright size={32} />
          ) : (
            <IoMdArrowDropleft size={32} />
          )}
        </button>
      </div>

      <nav className="flex-1">
        <ul className="space-y-6 text-base font-medium">
          <li>
            <Link
              href="/Analytical-Dashboard"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-indigo-700 hover:text-yellow-300 transition"
            >
              <FaChartBar />
              {!collapsed && "Analytical Dashboard"}
            </Link>
          </li>
          <li>
            <Link
              href="/Trading-Signals"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-indigo-700 hover:text-yellow-300 transition"
            >
              <FaSignal />
              {!collapsed && "Trading Signals"}
            </Link>
          </li>
          <li>
            <Link
              href="/Orders"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-indigo-700 hover:text-yellow-300 transition"
            >
              <FaClipboardList />
              {!collapsed && "Orders & Positions"}
            </Link>
          </li>
          <li>
            <Link
              href="/backtest"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-indigo-700 hover:text-blue-400 transition"
            >
              📊 {!collapsed && "Backtest"}
            </Link>
          </li>
          <li>
            <Link
              href="/Analytics"
              className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-indigo-700 hover:text-yellow-300 transition"
            >
              <FaChartPie />
              {!collapsed && "Advanced Analytics"}
            </Link>
          </li>
        </ul>
      </nav>

      {!collapsed && (
        <div className="mt-8 text-xs text-gray-400 text-center">
          © 2025 SmartTradePro
        </div>
      )}
    </aside>
  );
}
