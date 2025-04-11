"use client";
import { useState } from "react";
import Link from "next/link";
import { FaChartBar, FaSignal, FaClipboardList, FaMoneyBill, FaChartPie } from "react-icons/fa";
import { IoMdArrowDropleft, IoMdArrowDropright } from "react-icons/io";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`bg-gray-800 text-white ${collapsed ? "w-20" : "w-64"} min-h-screen p-4 duration-300`}>
      <div className="flex justify-between items-center mb-8">
        {!collapsed && <h2 className="text-xl font-bold">Dashboard</h2>}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <IoMdArrowDropright size={48} /> : <IoMdArrowDropleft size={48} />}
        </button>
      </div>

      <ul className="space-y-12">
        <li>
          <Link href="/Analytical-Dashboard" className="flex items-center gap-3 hover:text-yellow-400">
            <FaChartBar /> {!collapsed && "Analytical Dashboard"}
          </Link>
        </li>
        <li>
          <Link href="/Trading-Signals" className="flex items-center gap-3 hover:text-yellow-400">
            <FaSignal /> {!collapsed && "Trading Signals"}
          </Link>
        </li>
        <li>
          <Link href="/Orders" className="flex items-center gap-3 hover:text-yellow-400">
            <FaClipboardList /> {!collapsed && "Orders and Positions"}
          </Link>
        </li>
        <li>
          <Link href="#" className="flex items-center gap-3 hover:text-yellow-400">
            <FaMoneyBill /> {!collapsed && "Returns"}
          </Link>
        </li>
        <li>
          <Link href="/Analytics" className="flex items-center gap-3 hover:text-yellow-400">
            <FaChartPie /> {!collapsed && "Advanced Analytics"}
          </Link>
        </li>
      </ul>
    </div>
  );
}
