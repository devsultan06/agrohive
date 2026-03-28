import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { orderService } from "../../services/admin/orderService";
import type { OrderStatus } from "../../types/api";
import { toast } from "react-hot-toast";

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("All");
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderService.getAllOrders();
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    try {
      await orderService.updateOrderStatus(id, status);
      toast.success(`Order updated to ${status}`);
      fetchOrders(); // Refresh list
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error("Failed to update status");
    }
  };

  const getStatusStyle = (status: string) => {
    const s = status.toUpperCase();
    switch (s) {
      case "DELIVERED":
        return "bg-[#ECFDF3] text-[#027A48]";
      case "SHIPPED":
        return "bg-[#EFF8FF] text-[#175CD3]";
      case "PROCESSING":
        return "bg-[#FFFAEB] text-[#B54708]";
      case "CANCELLED":
        return "bg-[#FEF3F2] text-[#B42318]";
      case "PLACED":
        return "bg-[#F2F4F7] text-[#344054]";
      default:
        return "bg-[#F2F4F7] text-[#344054]";
    }
  };

  const filtered = orders.filter((o) => {
    const matchesTab =
      activeTab === "All" || o.status.toUpperCase() === activeTab.toUpperCase();
    const matchesSearch =
      !search ||
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.user?.fullName.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const orderStats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "PROCESSING").length,
    shipped: orders.filter((o) => o.status === "SHIPPED").length,
    delivered: orders.filter((o) => o.status === "DELIVERED").length,
    cancelled: orders.filter((o) => o.status === "CANCELLED").length,
  };

  return (
    <AdminLayout title="Orders">
      <div className="space-y-5">
        {/* Order stats */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Total orders</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {orderStats.total}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Processing</p>
            <p className="text-[22px] font-semibold text-[#B54708]">
              {orderStats.processing}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Shipped</p>
            <p className="text-[22px] font-semibold text-[#175CD3]">
              {orderStats.shipped}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Delivered</p>
            <p className="text-[22px] font-semibold text-[#027A48]">
              {orderStats.delivered}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Cancelled</p>
            <p className="text-[22px] font-semibold text-[#B42318]">
              {orderStats.cancelled}
            </p>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EAECF0] flex justify-between items-center">
            <div className="flex items-center gap-1 p-0.5 bg-[#F9FAFB] rounded-lg border border-[#EAECF0]">
              {[
                "All",
                "Placed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === tab ? "bg-white text-[#344054] shadow-sm" : "text-[#667085]"}`}
                >
                  {tab}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#EAECF0] rounded-lg w-48">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#98A2B3"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search orders..."
                className="bg-transparent border-none outline-none text-[12px] w-full text-[#667085]"
                style={{ fontFamily: "inherit" }}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EAECF0] text-[11px] text-[#667085]">
                  <th className="px-5 py-2.5 font-medium">Order ID</th>
                  <th className="px-5 py-2.5 font-medium">Customer</th>
                  <th className="px-5 py-2.5 font-medium">Items</th>
                  <th className="px-5 py-2.5 font-medium">Total</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium">Date</th>
                  <th className="px-5 py-2.5 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-[13px] text-gray-400"
                    >
                      Loading orders...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-10 text-center text-[13px] text-gray-400"
                    >
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((o) => (
                    <tr
                      key={o.id}
                      className="border-b border-[#F2F4F7] last:border-0 hover:bg-[#F9FAFB] transition-colors group"
                    >
                      <td className="px-5 py-3">
                        <span className="text-[13px] font-medium text-[#1C6206]">
                          {o.orderNumber}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-400">
                            {o.user?.fullName?.[0] || "U"}
                          </div>
                          <div>
                            <p className="text-[13px] font-medium text-[#101828]">
                              {o.user?.fullName}
                            </p>
                            <p className="text-[10px] text-[#98A2B3] truncate max-w-[120px]">
                              {o.user?.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <p className="text-[12px] text-[#667085]">
                          {o._count?.items} items
                        </p>
                      </td>
                      <td className="px-5 py-3 text-[13px] font-medium text-[#101828]">
                        ₦{o.totalAmount.toLocaleString()}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${getStatusStyle(o.status)}`}
                        >
                          {o.status.toLowerCase()}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#667085]">
                        {new Date(o.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <select
                            className="text-[11px] bg-white border border-[#D0D5DD] rounded-md px-2 py-1 outline-none text-[#344054]"
                            value={o.status}
                            onChange={(e) =>
                              handleUpdateStatus(
                                o.id,
                                e.target.value as OrderStatus,
                              )
                            }
                          >
                            <option value="PLACED">Placed</option>
                            <option value="PROCESSING">Processing</option>
                            <option value="SHIPPED">Shipped</option>
                            <option value="DELIVERED">Delivered</option>
                            <option value="CANCELLED">Cancelled</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#EAECF0] flex justify-between items-center text-[12px] text-[#667085]">
            <p>
              Showing {filtered.length} of {orders.length} orders
            </p>
            <div className="flex gap-1">
              <button className="px-3 py-1 border border-[#D0D5DD] rounded-md hover:bg-[#F9FAFB] text-[#344054] font-medium">
                Previous
              </button>
              <button className="px-3 py-1 border border-[#D0D5DD] rounded-md hover:bg-[#F9FAFB] text-[#344054] font-medium">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOrders;
