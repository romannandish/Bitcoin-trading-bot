import React, { useState } from "react";

const BacktestPanel = ({ onRunBacktest }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!startDate || !endDate) return alert("Select both dates");
    onRunBacktest(startDate, endDate);
  };

  return (
    <div className="bg-gradient-to-br from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6 rounded-2xl shadow-2xl max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 border-b pb-3">
        📅 Backtest BTC Strategy
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end"
      >
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-md transition duration-300"
          >
            🚀 Run Backtest
          </button>
        </div>
      </form>
    </div>
  );
};

export default BacktestPanel;
