import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const PnLChart = ({ trades }) => {
  let cumulativeProfit = 0;

  const chartData = trades.map((trade) => {
    const profit = Number(trade.profitLoss) || 0;
    cumulativeProfit += profit;
    return {
      time: new Date(trade.time).toLocaleTimeString(),
      cumulativeProfit,
    };
  });

  const totalProfit = trades.reduce((acc, trade) => acc + (Number(trade.profitLoss) || 0), 0);
  const wins = trades.filter(trade => Number(trade.profitLoss) > 0).length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(2) : "0.00";
  const avgProfit = trades.length ? (totalProfit / trades.length).toFixed(2) : "0.00";

  let peak = 0;
  let maxDrawdown = 0;
  let cumulativeProfitCopy = 0;

  trades.forEach((trade) => {
    const profit = Number(trade.profitLoss) || 0;
    cumulativeProfitCopy += profit;
    peak = Math.max(peak, cumulativeProfitCopy);
    maxDrawdown = Math.max(maxDrawdown, peak - cumulativeProfitCopy);
  });

  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-2">
        📈 Performance Overview
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
          <XAxis dataKey="time" stroke="#aaa" />
          <YAxis stroke="#aaa" />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cumulativeProfit" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-green-500 to-green-400 text-white rounded-xl p-4 shadow-md">
          <p className="text-sm">💰 Total Profit</p>
          <p className="text-xl font-semibold">${totalProfit.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-400 text-white rounded-xl p-4 shadow-md">
          <p className="text-sm">🎯 Win Rate</p>
          <p className="text-xl font-semibold">{winRate}%</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-400 text-white rounded-xl p-4 shadow-md">
          <p className="text-sm">📊 Avg. Profit/Trade</p>
          <p className="text-xl font-semibold">${avgProfit}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-400 text-white rounded-xl p-4 shadow-md">
          <p className="text-sm">⚠️ Max Drawdown</p>
          <p className="text-xl font-semibold">
            ${maxDrawdown.toFixed(2)} <span className="text-sm">(-{peak > 0 ? ((maxDrawdown / peak) * 100).toFixed(2) : "0.00"}%)</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PnLChart;
