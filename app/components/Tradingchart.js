"use client";
import React, { useEffect, useRef } from "react";

const TradingChart = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      new window.TradingView.widget({
        autosize: true,
        symbol: "BINANCE:BTCUSDT",
        interval: "15",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        container_id: "tradingview_chart",
      });
    };
    containerRef.current.appendChild(script);
  }, []);

  return <div id="tradingview_chart" ref={containerRef} className="h-[500px] w-full"></div>;
};

export default TradingChart;
