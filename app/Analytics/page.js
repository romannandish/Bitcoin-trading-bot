"use client";

import React, { useState, useEffect } from "react";
import PnLChart from "../components/PnLChart";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const res = await fetch("/api/trade/add", { method: "GET" });
        const data = await res.json();
        if (data.success) {
          setTrades(data.trades);
          console.log("✅ Fetched trade history");
        }
      } catch (err) {
        console.error("❌ Error fetching trade history:", err);
      }
    };

    fetchTradeHistory();
  }, []);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-extrabold mb-8 tracking-tight">
            📊 Trading Dashboard
          </h1>

          {trades.length > 0 ? (
            <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 sm:p-8 rounded-2xl shadow-2xl transition-all">
              <PnLChart trades={trades} />
            </div>
          ) : (
            <div className="mt-10 flex items-center gap-3 text-yellow-300 bg-yellow-800/20 border border-yellow-500 p-4 rounded-lg">
              ⚠️ No trade data available. Try placing a trade or running a backtest.
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
