import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

const AdminOrders = () => {
  const [activeTab, setActiveTab] = useState("All");

  // Order data matching the app's OrdersScreen structure:
  // id, date, status (processing/shipped/delivered/cancelled), total, items, products, delivery address, payment method
  const orders = [
    {
      id: "ORD-2024-001",
      user: "Sultan Dev",
      avatar: "https://i.pravatar.cc/150?u=sultan",
      items: "Mini Tractor, Drone Sprayer",
      qty: 3,
      total: "₦45,000",
      status: "delivered",
      payment: "Interswitch",
      date: "Feb 10, 2026",
      address: "12, Victoria Island, Lagos",
    },
    {
      id: "ORD-2024-002",
      user: "Aisha Mohammed",
      avatar: "https://i.pravatar.cc/150?u=aisha",
      items: "Rotavator",
      qty: 1,
      total: "₦899,000",
      status: "shipped",
      payment: "Interswitch",
      date: "Feb 12, 2026",
      address: "45, Wuse, Abuja",
    },
    {
      id: "ORD-2024-003",
      user: "John Bosco",
      avatar: "https://i.pravatar.cc/150?u=john",
      items: "EcoWagon",
      qty: 1,
      total: "₦450,000",
      status: "processing",
      payment: "Interswitch",
      date: "Feb 14, 2026",
      address: "8, GRA, Kano",
    },
    {
      id: "ORD-2024-004",
      user: "Emeka Obi",
      avatar: "https://i.pravatar.cc/150?u=emeka",
      items: "Mini Tractor (Used)",
      qty: 1,
      total: "₦4,500,000",
      status: "processing",
      payment: "Interswitch",
      date: "Mar 02, 2026",
      address: "22, New Haven, Enugu",
    },
    {
      id: "ORD-2024-005",
      user: "Mariam Bello",
      avatar: "https://i.pravatar.cc/150?u=mariam",
      items: "Seed Planter",
      qty: 2,
      total: "₦640,000",
      status: "cancelled",
      payment: "Interswitch",
      date: "Mar 05, 2026",
      address: "3, Barnawa, Kaduna",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "delivered":
        return "bg-[#ECFDF3] text-[#027A48]";
      case "shipped":
        return "bg-[#EFF8FF] text-[#175CD3]";
      case "processing":
        return "bg-[#FFFAEB] text-[#B54708]";
      case "cancelled":
        return "bg-[#FEF3F2] text-[#B42318]";
      default:
        return "bg-[#F2F4F7] text-[#344054]";
    }
  };

  const filtered =
    activeTab === "All"
      ? orders
      : orders.filter((o) => o.status === activeTab.toLowerCase());

  const orderStats = {
    total: orders.length,
    processing: orders.filter((o) => o.status === "processing").length,
    shipped: orders.filter((o) => o.status === "shipped").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
    cancelled: orders.filter((o) => o.status === "cancelled").length,
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
              {["All", "Processing", "Shipped", "Delivered", "Cancelled"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === tab ? "bg-white text-[#344054] shadow-sm" : "text-[#667085]"}`}
                  >
                    {tab}
                  </button>
                ),
              )}
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
                placeholder="Search orders..."
                className="bg-transparent border-none outline-none text-[12px] w-full text-[#667085]"
                style={{ fontFamily: "inherit" }}
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EAECF0] text-[11px] text-[#667085]">
                <th className="px-5 py-2.5 font-medium">Order ID</th>
                <th className="px-5 py-2.5 font-medium">Customer</th>
                <th className="px-5 py-2.5 font-medium">Items</th>
                <th className="px-5 py-2.5 font-medium">Total</th>
                <th className="px-5 py-2.5 font-medium">Payment</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
                <th className="px-5 py-2.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="border-b border-[#F2F4F7] last:border-0 hover:bg-[#F9FAFB] transition-colors group"
                >
                  <td className="px-5 py-3">
                    <span className="text-[13px] font-medium text-[#1C6206]">
                      {o.id}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={o.avatar}
                        className="w-7 h-7 rounded-full"
                        alt=""
                      />
                      <div>
                        <p className="text-[13px] font-medium text-[#101828]">
                          {o.user}
                        </p>
                        <p className="text-[10px] text-[#98A2B3] truncate max-w-[120px]">
                          {o.address}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <p className="text-[12px] text-[#667085] truncate max-w-[140px]">
                      {o.items}
                    </p>
                    <p className="text-[10px] text-[#98A2B3]">
                      {o.qty} item{o.qty > 1 ? "s" : ""}
                    </p>
                  </td>
                  <td className="px-5 py-3 text-[13px] font-medium text-[#101828]">
                    {o.total}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#667085"
                        strokeWidth="1.8"
                      >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                      </svg>
                      <span className="text-[12px] text-[#667085]">
                        {o.payment}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${getStatusStyle(o.status)}`}
                    >
                      {o.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[#667085]">
                    {o.date}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-[11px] font-medium text-[#667085] px-2.5 py-1 border border-[#D0D5DD] rounded-md hover:bg-[#F9FAFB]">
                        Details
                      </button>
                      {o.status === "processing" && (
                        <button className="text-[11px] font-medium text-[#175CD3] px-2.5 py-1 border border-[#B2DDFF] rounded-md bg-[#EFF8FF] hover:bg-[#DBEAFE]">
                          Ship
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

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
