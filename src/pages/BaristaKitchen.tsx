

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout, getUser } from "../services/authService";

interface Order {
  id: string;
  orderNumber: string;
  items: {
    name: string;
    quantity: number;
    size?: string;
    notes?: string;
  }[];
  status: "pending" | "preparing" | "ready" | "completed";
  createdAt: string;
  type: "dine-in" | "takeaway";
}

// Mock data - replace with WebSocket real-time updates
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "A001",
    items: [
      { name: "Ice Latte", quantity: 2, size: "Large", notes: "Less sugar" },
      { name: "Croissant", quantity: 1 },
    ],
    status: "pending",
    createdAt: new Date().toISOString(),
    type: "dine-in",
  },
  {
    id: "2",
    orderNumber: "A002",
    items: [
      { name: "Cappuccino", quantity: 1, size: "Medium" },
      { name: "Muffin", quantity: 2 },
    ],
    status: "preparing",
    createdAt: new Date(Date.now() - 5 * 60000).toISOString(),
    type: "takeaway",
  },
];

export default function BaristaKitchen() {
  const navigate = useNavigate();
  const user = getUser();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<"all" | "pending" | "preparing" | "ready">("all");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const updateOrderStatus = (orderId: string, newStatus: Order["status"]) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const filteredOrders = orders.filter((order) =>
    filter === "all" ? true : order.status === filter
  );

  const getStatusColor = (status: Order["status"]) => {
    const colors = {
      pending: "bg-red-100 text-red-800 border-red-200",
      preparing: "bg-yellow-100 text-yellow-800 border-yellow-200",
      ready: "bg-green-100 text-green-800 border-green-200",
      completed: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return colors[status];
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-orange-600 text-white shadow-lg">
        <div className="flex justify-between items-center px-6 py-4">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold">☕ Barista Kitchen</h1>
            <span className="bg-orange-700 px-3 py-1 rounded-full text-sm">
              {user?.username}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">🔔 {orders.filter(o => o.status === "pending").length} New Orders</span>
            <button
              onClick={handleLogout}
              className="bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="bg-white border-b px-6 py-3">
        <div className="flex gap-2">
          {(["all", "pending", "preparing", "ready"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg font-medium capitalize transition-colors ${
                filter === f
                  ? "bg-orange-100 text-orange-700"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {f} ({f === "all" ? orders.length : orders.filter(o => o.status === f).length})
            </button>
          ))}
        </div>
      </div>

      {/* Orders Grid */}
      <main className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-lg shadow-md border-2 border-transparent hover:border-orange-300 transition-all"
            >
              {/* Order Header */}
              <div className="p-4 border-b bg-gray-50 rounded-t-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Order #{order.orderNumber}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.toUpperCase()}
                  </span>
                </div>
                <span
                  className={`inline-block mt-2 px-2 py-1 rounded text-xs ${
                    order.type === "dine-in"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-purple-100 text-purple-800"
                  }`}
                >
                  {order.type === "dine-in" ? "🍽️ Dine-in" : "🥡 Takeaway"}
                </span>
              </div>

              {/* Order Items */}
              <div className="p-4">
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-start">
                      <div>
                        <span className="font-medium">{item.quantity}x {item.name}</span>
                        {item.size && (
                          <span className="text-sm text-gray-500 ml-2">({item.size})</span>
                        )}
                        {item.notes && (
                          <p className="text-sm text-orange-600 mt-1">📝 {item.notes}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t bg-gray-50 rounded-b-lg">
                {order.status === "pending" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "preparing")}
                    className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Start Preparing
                  </button>
                )}
                {order.status === "preparing" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "ready")}
                    className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Mark Ready
                  </button>
                )}
                {order.status === "ready" && (
                  <button
                    onClick={() => updateOrderStatus(order.id, "completed")}
                    className="w-full bg-gray-500 hover:bg-gray-600 text-white py-2 rounded-lg font-medium transition-colors"
                  >
                    Complete Order
                  </button>
                )}
                {order.status === "completed" && (
                  <span className="w-full block text-center text-gray-500 py-2">
                    ✓ Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No orders found</p>
          </div>
        )}
      </main>
    </div>
  );
}
