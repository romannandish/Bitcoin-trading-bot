export default async function handler(req, res) {
  const { start, end } = req.query;

  if (!start || !end) {
    return res.status(400).json({ success: false, message: "Missing dates" });
  }

  try {
    const startTime = new Date(start).getTime();
    const endTime = new Date(end).getTime();

    const url = `https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&startTime=${startTime}&endTime=${endTime}&limit=1000`;
    const response = await fetch(url);
    const rawData = await response.json();

    const priceHistory = rawData.map(kline => ({
      time: kline[0], // Keep raw timestamp, not formatted string
      close: parseFloat(kline[4])
    }));

    const trades = runEMABacktest(priceHistory);
    res.status(200).json({ success: true, trades });
  } catch (err) {
    console.error("Backtest error:", err);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}

function calculateEMA(prices, period) {
  const k = 2 / (period + 1);
  let ema = prices[0];

  for (let i = 1; i < prices.length; i++) {
    ema = prices[i] * k + ema * (1 - k);
  }

  return ema;
}

function runEMABacktest(priceHistory) {
  const trades = [];
  let openBuy = null;

  for (let i = 21; i < priceHistory.length; i++) {
    const slice = priceHistory.slice(i - 21, i + 1);
    const closes = slice.map(p => p.close);

    const shortEMA = calculateEMA(closes.slice(-9), 9);
    const longEMA = calculateEMA(closes, 21);
    const price = closes[closes.length - 1];
    const time = slice[slice.length - 1].time; // Send raw timestamp

    if (!openBuy && shortEMA > longEMA) {
      openBuy = { action: "BUY", price, time, isOpen: true };
      trades.push(openBuy);
    }

    if (openBuy && shortEMA < longEMA) {
      const profitLoss = (price - openBuy.price).toFixed(2);
      trades.push({
        action: "SELL",
        price,
        time,
        profitLoss: parseFloat(profitLoss),
        isOpen: false
      });
      openBuy = null;
    }
  }

  return trades;
}
