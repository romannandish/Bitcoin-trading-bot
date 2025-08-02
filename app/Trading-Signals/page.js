"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { toast, Toaster } from "react-hot-toast";

export default function BTCSignalBot() {
  const [btcPrice, setBtcPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [signals, setSignals] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [lastBuyPrice, setLastBuyPrice] = useState(null);
  const [openPosition, setOpenPosition] = useState(false);
  const [totalProfitLoss, setTotalProfitLoss] = useState(0);
  const [userStopLoss, setUserStopLoss] = useState(0.5);
  const [userTargetProfit, setUserTargetProfit] = useState(1);

  useEffect(() => {
    const ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const price = parseFloat(data.p);
      setBtcPrice(price.toFixed(2));
      setPriceHistory(prev => {
        const updated = [...prev, price];
        return updated.length > 50 ? updated.slice(-50) : updated;
      });
    };
    return () => ws.close();
  }, []);

  useEffect(() => {
    const fetchTradeHistory = async () => {
      try {
        const res = await fetch("/api/trade/add", { method: "GET" });
        const data = await res.json();
        if (data.success) setTradeHistory(data.trades);
      } catch (err) {
        console.error(err);
      }
    };
    fetchTradeHistory();
  }, []);

  const calculateEMA = (prices, period) => {
    const k = 2 / (period + 1);
    let ema = prices.slice(0, period).reduce((sum, price) => sum + price, 0) / period;
    for (let i = period; i < prices.length; i++) {
      ema = prices[i] * k + ema * (1 - k);
    }
    return ema;
  };

  const generateSignalFromEMA = () => {
    if (priceHistory.length < 21) return;
    const shortEMA = calculateEMA(priceHistory, 9);
    const longEMA = calculateEMA(priceHistory, 21);
    const lastSignal = signals[0]?.action;
    let action = null;
    if (shortEMA > longEMA && lastSignal !== "BUY") action = "BUY";
    if (shortEMA < longEMA && lastSignal !== "SELL") action = "SELL";
    if (action) {
      const signal = {
        action,
        price: btcPrice,
        time: new Date().toLocaleTimeString(),
      };
      setSignals((prev) => [signal, ...prev.slice(0, 9)]);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => generateSignalFromEMA(), 1000);
    return () => clearInterval(interval);
  }, [priceHistory]);

  const saveTradeToDB = async (tradeData) => {
    try {
      await fetch("/api/trade/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tradeData),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleTrade = (action) => {
    if (action === "BUY") {
      if (openPosition) return toast.error("You already have an open BUY. Sell first!");
      const tradeData = {
        action: "BUY",
        price: btcPrice,
        time: new Date().toISOString(),
        isOpen: true,
      };
      setLastBuyPrice(btcPrice);
      setOpenPosition(true);
      setTradeHistory((prev) => [tradeData, ...prev]);
      saveTradeToDB(tradeData);
      toast.success(`Bought BTC at $${btcPrice}`);
    }
    if (action === "SELL") {
      if (!openPosition) return toast.error("You can't SELL without buying first!");
      const profitLoss = (btcPrice - lastBuyPrice).toFixed(2);
      const tradeData = {
        action: "SELL",
        price: btcPrice,
        time: new Date().toISOString(),
        profitLoss: parseFloat(profitLoss),
        isOpen: false,
      };
      setTradeHistory((prev) => [tradeData, ...prev]);
      setTotalProfitLoss((prev) => prev + parseFloat(profitLoss));
      setOpenPosition(false);
      setLastBuyPrice(null);
      saveTradeToDB(tradeData);
      toast.success(`Sold BTC at $${btcPrice} | P/L: $${profitLoss}`);
    }
  };

  useEffect(() => {
    if (!openPosition || !lastBuyPrice) return;
    const interval = setInterval(() => {
      const currentPrice = parseFloat(btcPrice);
      const buyPrice = parseFloat(lastBuyPrice);
      const lossPercent = ((buyPrice - currentPrice) / buyPrice) * 100;
      const profitPercent = ((currentPrice - buyPrice) / buyPrice) * 100;
      if (lossPercent >= userStopLoss) {
        handleTrade("SELL");
        toast.error(`Stop Loss Hit! Auto-sold at $${currentPrice}`);
      }
      if (profitPercent >= userTargetProfit) {
        handleTrade("SELL");
        toast.success(`Target Profit Reached! Auto-sold at $${currentPrice}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [btcPrice, openPosition, lastBuyPrice, userStopLoss, userTargetProfit]);

  return (
    <div className="flex min-h-screen bg-gray-200">
      <Sidebar />
<main className="flex-1 p-4 sm:p-6 lg:p-10 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-black text-black dark:text-white overflow-y-auto">
  <Toaster />
  <div className="max-w-7xl mx-auto space-y-8">
    {/* Heading */}
    <div className="text-center">
      <h1 className="text-4xl font-extrabold mb-3">⚡ BTC Signal Bot</h1>
      <div className="inline-flex items-center gap-3 px-6 py-2 bg-white dark:bg-gray-700 shadow rounded-full">
        <span className="text-2xl font-semibold text-green-600">${btcPrice}</span>
        <span className="text-xs uppercase text-gray-400">Live</span>
      </div>
    </div>

    {/* Signals & Actions */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Signals */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">📶 Signals</h2>
        <div className="space-y-3 max-h-[300px] overflow-y-auto">
          {signals.length > 0 ? (
            signals.map((signal, idx) => (
              <div
                key={idx}
                className={`flex justify-between items-center px-4 py-2 rounded-md ${
                  signal.action === "BUY"
                    ? "bg-green-100 dark:bg-green-900"
                    : "bg-red-100 dark:bg-red-900"
                }`}
              >
                <span className="font-bold">{signal.action}</span>
                <span className="text-sm">${signal.price}</span>
                <span className="text-xs text-gray-500">{signal.time}</span>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No signals yet.</p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 space-y-5">
        <h2 className="text-xl font-bold">💼 Trade Actions</h2>
        <div className="flex gap-4">
          <button
            onClick={() => handleTrade("BUY")}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition"
          >
            Buy
          </button>
          <button
            onClick={() => handleTrade("SELL")}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold transition"
          >
            Sell
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4">
          <label className="text-sm font-medium">
            Stop Loss (%)
            <input
              type="number"
              value={userStopLoss}
              onChange={(e) => setUserStopLoss(parseFloat(e.target.value))}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </label>
          <label className="text-sm font-medium">
            Target Profit (%)
            <input
              type="number"
              value={userTargetProfit}
              onChange={(e) => setUserTargetProfit(parseFloat(e.target.value))}
              className="w-full mt-1 p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700"
            />
          </label>
        </div>
        <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold">
            Total P/L:{" "}
            <span
              className={`${
                totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              ${totalProfitLoss.toFixed(2)}
            </span>
          </h3>
        </div>
      </div>
    </div>

{/* Trade History */}
<div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6 transition duration-300">
  <h2 className="text-2xl font-bold mb-5 border-b pb-2 border-gray-200 dark:border-gray-700">
    📜 Trade History
  </h2>

  <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700 scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600">
    {tradeHistory.length > 0 ? (
      tradeHistory.map((trade, idx) => (
        <div
          key={idx}
          className="py-3 flex justify-between items-center px-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md transition"
        >
          <span className="font-semibold text-gray-700 dark:text-gray-200">{trade.action}</span>
          <span className="text-sm text-gray-500 dark:text-gray-400">${trade.price}</span>
          <span
            className={`font-bold ${
              trade.profitLoss >= 0
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {trade.profitLoss !== undefined
              ? trade.profitLoss > 0
                ? `+${trade.profitLoss}`
                : trade.profitLoss
              : ""}
          </span>
        </div>
      ))
    ) : (
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-6">
        No trade history available.
      </p>
    )}
  </div>
</div>

  </div>
</main>

    </div>
  );
}
