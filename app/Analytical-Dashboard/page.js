import React from "react";
import TradingChart from "../components/Tradingchart";
import Sidebar from "../components/Sidebar";

const Page = () => {
  return (
    <div className="flex">
      {/* Sidebar (only on this page) */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Bitcoin Live Chart</h1>

        {/* Trading View Chart */}
        <TradingChart />
      </div>
    </div>
  );
};

export default Page;
