import React from "react";
import TradingChart from "../components/Tradingchart";
import Sidebar from "../components/Sidebar";

const Page = () => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 tracking-tight">
            📈 Bitcoin Live Chart
          </h1>

          {/* Chart Container */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 sm:p-6 transition-all">
            <TradingChart />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Page;
