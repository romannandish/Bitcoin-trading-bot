import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const PnLChart = ({ trades }) => {
  let cumulativeProfit = 0;

  // Ensure all profitLoss values are valid numbers
  const chartData = trades.map((trade) => {
    const profit = Number(trade.profitLoss) || 0;  // Prevent NaN errors
    cumulativeProfit += profit;
    return {
      time: new Date(trade.time).toLocaleTimeString(),
      cumulativeProfit,
    };
  });

  // Total Profit Calculation
  const totalProfit = trades.reduce((acc, trade) => acc + (Number(trade.profitLoss) || 0), 0);

  // Win Rate Calculation
  const wins = trades.filter(trade => Number(trade.profitLoss) > 0).length;
  const winRate = trades.length ? ((wins / trades.length) * 100).toFixed(2) : "0.00";

  // Average Profit per Trade
  const avgProfit = trades.length ? (totalProfit / trades.length).toFixed(2) : "0.00";

  // Max Drawdown Calculation
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
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">📈 PnL Chart</h2>

      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="cumulativeProfit" stroke="#82ca9d" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>

      {/* Trading Statistics */}
      <div className="mt-6 space-y-2 text-lg">
        <p>💰 <strong>Total Profit:</strong> ${totalProfit.toFixed(2)}</p>
        <p>🎯 <strong>Win Rate:</strong> {winRate}%</p>
        <p>📊 <strong>Average Profit per Trade:</strong> ${avgProfit}</p>
        <p>⚠️ <strong>Max Drawdown:</strong> ${maxDrawdown.toFixed(2)} (-{peak > 0 ? ((maxDrawdown / peak) * 100).toFixed(2) : "0.00"}%)</p>
      </div>
    </div>
  );
};

export default PnLChart;

