import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "./index.css";
import { Maximize2, CirclePlus } from "lucide-react";

function App() {
  const [data, setData] = useState([]);
  const [timeframe, setTimeframe] = useState("7"); // default to 1 week (7 days)
  const [currentPrice, setCurrentPrice] = useState(null);
  const [priceChange, setPriceChange] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchChartData = async (days) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/coins/bitcoin/market_chart`,
        {
          params: {
            vs_currency: "usd",
            days: days,
          },
        }
      );

      const formattedData = response.data.prices.map((price) => ({
        time: new Date(price[0]).toLocaleDateString(),
        price: price[1].toFixed(2),
      }));

      setData(formattedData);
    } catch (error) {
      console.error("Error fetching Bitcoin data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentPrice = async () => {
    try {
      const response = await axios.get(
        "https://api.coingecko.com/api/v3/simple/price",
        {
          params: {
            ids: "bitcoin",
            vs_currencies: "usd",
            include_24hr_change: "true",
          },
        }
      );

      const priceData = response.data.bitcoin;
      setCurrentPrice(priceData.usd.toFixed(2));
      setPriceChange(priceData.usd_24h_change.toFixed(2));
    } catch (error) {
      console.error("Error fetching current Bitcoin price:", error);
    }
  };

  useEffect(() => {
    fetchChartData(timeframe);
    fetchCurrentPrice();
  }, [timeframe]);

  const handleTimeframeChange = (days) => {
    setTimeframe(days);
  };

  return (
    <div className="min-h-screen bg-white text-black font-sans p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-6xl font-semibold mb-2 flex items-end">
          {currentPrice ? `$${currentPrice}` : "Loading..."}
          <span className="text-2xl font-light ml-2 mb-7">USD</span>
        </div>
        <div
          className={`text-lg font-medium mb-4 ${
            priceChange >= 0 ? "text-green-400" : "text-red-400"
          }`}
        >
          {priceChange ? `+${priceChange}% (24h)` : "Loading..."}
        </div>

        <nav className="flex space-x-6 border-b border-gray-800 pb-2 mb-6 text-lg">
          <a href="#" className="text-gray-400 hover:text-black">
            Summary
          </a>
          <a
            href="#"
            className="text-black font-semibold border-b-4 border-blue-500"
          >
            Chart
          </a>
          <a href="#" className="text-gray-400 hover:text-black">
            Statistics
          </a>
          <a href="#" className="text-gray-400 hover:text-black">
            Analysis
          </a>
          <a href="#" className="text-gray-400 hover:text-black">
            Settings
          </a>
        </nav>

        <div className="bg-white p-6 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <div className="flex">
              <button className=" text-gray-500 text-xl px-4 py-2 rounded-full hover:bg-gray-100">
                <div className="flex gap-2">
                  <Maximize2 />
                  Fullscreen
                </div>
              </button>
              <button className="text-gray-500 text-xl px-4 py-2 rounded-full hover:bg-gray-100">
                <div className="flex gap-2">
                  <CirclePlus />
                  Compare
                </div>
              </button>
            </div>
            <div className="flex space-x-4">
              <button
                className={`px-4 py-2 rounded-md ${
                  timeframe === "1"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-white"
                }`}
                onClick={() => handleTimeframeChange("1")}
              >
                1d
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  timeframe === "7"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => handleTimeframeChange("7")}
              >
                1w
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  timeframe === "30"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => handleTimeframeChange("30")}
              >
                1M
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  timeframe === "180"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => handleTimeframeChange("180")}
              >
                6M
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  timeframe === "365"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => handleTimeframeChange("365")}
              >
                1y
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  timeframe === "max"
                    ? "bg-violet-600 text-white"
                    : "text-gray-400 hover:text-black"
                }`}
                onClick={() => handleTimeframeChange("max")}
              >
                MAX
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg overflow-hidden h-64 relative">
            {loading ? (
              <p className="text-center mt-24">Loading chart...</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="time" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Line
                    type="monotone"
                    dataKey="price"
                    stroke="#6366F1"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
            {!loading && (
              <>
                <div className="absolute top-4 right-4 text-sm text-white bg-gray-700 px-2 py-1 rounded">
                  {data.length > 0 && `$${data[data.length - 1].price}`}
                </div>
                <div className="absolute bottom-4 right-4 text-sm text-white bg-gray-700 px-2 py-1 rounded">
                  {data.length > 0 && `$${data[0].price}`}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
