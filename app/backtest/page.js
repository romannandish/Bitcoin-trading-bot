"use client";

import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import BacktestPanel from "../components/BacktestPanel";
import PnLChart from "../components/PnLChart";

const BacktestPage = () => {
  const [backtestTrades, setBacktestTrades] = useState([]);
  const [loading, setLoading] = useState(false);

  const runBacktest = async (start, end) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/backtest?start=${start}&end=${end}`);
      const data = await res.json();
      if (data.success) {
        const formattedTrades = data.trades.map((trade) => ({
          ...trade,
          time:
            typeof window !== "undefined"
              ? new Date(trade.time).toLocaleTimeString()
              : trade.time,
        }));
        setBacktestTrades(formattedTrades);
      } else {
        alert("Backtest failed.");
      }
    } catch (err) {
      console.error(err);
      alert("Error while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <Sidebar />
      <main className="flex-1 p-6 sm:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-8 tracking-tight">
            📊 Backtest BTC Strategy
          </h1>

          <div className="mb-10">
            <BacktestPanel onRunBacktest={runBacktest} />
          </div>

          {loading && (
            <div className="flex items-center gap-3 mt-6 text-yellow-400 animate-pulse text-lg">
              <span className="animate-spin border-t-2 border-b-2 border-yellow-400 rounded-full h-5 w-5" />
              ⏳ Running backtest...
            </div>
          )}

          {!loading && backtestTrades.length > 0 && (
            <div className="mt-10 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-2xl shadow-2xl text-black dark:text-white transition-all">
              <PnLChart trades={backtestTrades} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BacktestPage;
