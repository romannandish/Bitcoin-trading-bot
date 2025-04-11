"use client";
import React, { useState, useEffect } from "react";
import PnLChart from "../components/PnLChart"; // Import PnLChart component
import Sidebar from "../components/Sidebar"; // Import Sidebar component


const Dashboard = () => {
  const [trades, setTrades] = useState([]);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const res = await fetch("/api/trade/add", { method: "GET" });
        const data = await res.json();
        if (data.success) {
          setTrades(data.trades); // Set fetched trades in history
          console.log("✅ Fetched trade history");
        }
      } catch (err) {
        console.error("❌ Error fetching trade history:", err);
      }
    };

    fetchTradeHistory();
  }, []);

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar Component */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">📊 Trading Dashboard</h1>
        {trades.length > 0 ? (
          <PnLChart trades={trades} /> // Pass fetched trades to PnLChart
        ) : (
          <p>No trade data available.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
