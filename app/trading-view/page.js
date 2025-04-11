import Sidebar from "../components/Sidebar";

export default function TradingViewPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8 bg-gray-900 text-white">
        <h1 className="text-3xl font-bold mb-6">Trading View</h1>
        {/* Your Trading Content */}
      </div>
    </div>
  );
}
