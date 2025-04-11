"use client";
import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { toast, Toaster } from "react-hot-toast";

export default function TradeHistory() {
  const [tradeHistory, setTradeHistory] = useState([]);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const res = await fetch("/api/trade/add", { method: "GET" });
        const data = await res.json();
       
        if (data.success) {
          setTradeHistory(data.trades);
          calculateTotalPL(data.trades);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTradeHistory();
  }, []);

  const calculateTotalPL = (trades) => {
    const total = trades.reduce((acc, trade) => acc + (trade.profitLoss || 0), 0);
    setTotalProfitLoss(total);
  };

  const hasOpenBuyPosition = tradeHistory.some((trade) => trade.action === "BUY");

  const handleExitTrade = async () => {
    const buyTrade = tradeHistory.find((trade) => trade.action === "BUY");
    if (!buyTrade) return;

    try {
      const res = await fetch(`/api/trade/exit/${buyTrade._id}`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        console.log("✅ Trade exited successfully");
        const updatedTrades = tradeHistory.filter((trade) => trade._id !== buyTrade._id);
        setTradeHistory(updatedTrades);
        calculateTotalPL(updatedTrades);
        toast.success("Trade exited successfully!");
      }
    } catch (err) {
      console.error("❌ Error exiting trade:", err);
      toast.error("Failed to exit trade!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white flex">
      <Sidebar />
      <div className="flex-1 p-8 overflow-y-auto">
        <Toaster position="top-center" reverseOrder={false} />
        <h1 className="text-5xl font-bold text-center mb-12">🧾 Trade History</h1>

        <div className="flex flex-col items-center gap-4 mb-10">
          <div
            className={`p-6 rounded-2xl text-center text-2xl font-bold shadow-md transition-all duration-300 ${
              totalProfitLoss >= 0 ? "text-green-400 bg-green-900/60" : "text-red-400 bg-red-900/60"
            }`}
          >
            Total P/L: {totalProfitLoss >= 0 ? "+" : "-"}${Math.abs(totalProfitLoss).toFixed(2)}
          </div>

          <button
            onClick={handleExitTrade}
            disabled={!hasOpenBuyPosition}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${
              hasOpenBuyPosition
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-gray-700 text-gray-400 cursor-not-allowed"
            }`}
          >
            Exit Trade
          </button>
        </div>

        {loading ? (
          <div className="text-center text-gray-400">Loading trade history...</div>
        ) : tradeHistory.length === 0 ? (
          <div className="text-center text-gray-500">No trades found 🚫</div>
        ) : (
          <ul className="space-y-6 max-h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
            {tradeHistory.map((trade) => (
              <li
                key={trade._id}
                className="bg-gray-800 hover:bg-gray-700 transition-all p-6 rounded-2xl flex items-center justify-between gap-6 shadow-lg"
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`px-4 py-2 rounded-full text-white font-bold shadow-md ${
                      trade.action === "BUY" ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {trade.action}
                  </span>
                  <div>
                    <div className="text-lg font-semibold">${trade.price}</div>
                    <div className="text-xs text-gray-400">{new Date(trade.time).toLocaleString()}</div>
                  </div>
                </div>

                <span
                  className={`font-bold ${
                    (trade.profitLoss ?? 0) >= 0 ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {(trade.profitLoss ?? 0) >= 0 ? "+" : "-"}${Math.abs(trade.profitLoss ?? 0).toFixed(2)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
