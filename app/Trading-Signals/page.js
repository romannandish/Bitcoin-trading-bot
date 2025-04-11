"use client";

import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { toast, Toaster } from "react-hot-toast";

export default function BTCSignalBot() {
  const [btcPrice, setBtcPrice] = useState(0);
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
      setBtcPrice(parseFloat(data.p).toFixed(2));
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

  useEffect(() => {
    const interval = setInterval(() => generateRandomSignal(), 1000);
    return () => clearInterval(interval);
  }, [btcPrice]);

  const generateRandomSignal = () => {
    const actions = ["BUY", "SELL"];
    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    const signal = {
      action: randomAction,
      price: btcPrice,
      time: new Date().toLocaleTimeString(),
    };
    setSignals((prev) => [signal, ...prev.slice(0, 9)]);
  };

  const saveTradeToDB = async (tradeData) => {
   
    try {
      console.log("request sending");
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
        isOpen: true,   // 🔥 Add this field
      };
  
      setLastBuyPrice(btcPrice);
      setOpenPosition(true);
      setTradeHistory((prev) => [tradeData, ...prev]);
      saveTradeToDB(tradeData);  // it will store this open BUY also
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
        isOpen: false,  // 🔥 Close the position
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

      <main className="flex-1 p-6 space-y-6">
        <Toaster />

        <div className="text-center mb-8">
  <h1 className="text-5xl font-extrabold mb-4 text-black">
    BTC Signal Bot
  </h1>
  <div className="inline-flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-full shadow-md">
    <span className="text-3xl font-bold text-green-600">
      ${btcPrice}
    </span>
    <span className="text-sm text-gray-500">Live</span>
  </div>
</div>


        <div className="flex flex-col md:flex-row gap-6">
          {/* Signal Section */}
          <div className="flex-1 bg-white rounded-2xl shadow p-4 space-y-4">
            <h2 className="text-xl font-semibold">Signals</h2>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {signals.map((signal, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    signal.action === "BUY" ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  <span className="font-bold">{signal.action}</span>
                  <span>${signal.price}</span>
                  <span className="text-sm text-gray-500">{signal.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Trade Section */}
          <div className="flex-1 bg-white rounded-2xl shadow p-4 space-y-4">
            <h2 className="text-xl font-semibold">Actions</h2>
            <div className="flex gap-4">
              <button
                onClick={() => handleTrade("BUY")}
                className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-lg transition"
              >
                Buy
              </button>
              <button
                onClick={() => handleTrade("SELL")}
                className="w-full py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg transition"
              >
                Sell
              </button>
            </div>

            <div className="space-y-2">
              <label className="block">
                Stop Loss (%)
                <input
                  type="number"
                  value={userStopLoss}
                  onChange={(e) => setUserStopLoss(parseFloat(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </label>
              <label className="block">
                Target Profit (%)
                <input
                  type="number"
                  value={userTargetProfit}
                  onChange={(e) => setUserTargetProfit(parseFloat(e.target.value))}
                  className="w-full mt-1 p-2 border rounded-lg"
                />
              </label>
            </div>

            <div className="pt-4 border-t">
              <h3 className="text-lg font-bold">Total P/L: <span className={`${totalProfitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>${totalProfitLoss.toFixed(2)}</span></h3>
            </div>
          </div>
        </div>

        {/* Trade History */}
        <div className="bg-white rounded-2xl shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Trade History</h2>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {tradeHistory.map((trade, idx) => (
              <div key={idx} className="flex justify-between p-3 border-b">
                <span className="font-bold">{trade.action}</span>
                <span>${trade.price}</span>
                <span className={`font-bold ${trade.profitLoss >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {trade.profitLoss ? (trade.profitLoss > 0 ? `+${trade.profitLoss}` : trade.profitLoss) : ""}
                </span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}    