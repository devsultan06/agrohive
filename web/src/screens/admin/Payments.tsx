import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const AdminPayments = () => {
  const [activeTab, setActiveTab] = useState("All");

  // Transactions via Interswitch — payment for products
  const transactions = [
    {
      id: "TXN-INT-0001",
      orderId: "ORD-2024-001",
      user: "Sultan Dev",
      avatar: "https://i.pravatar.cc/150?u=sultan",
      amount: "₦45,000",
      status: "success",
      method: "Card (**** 4242)",
      date: "Feb 10, 2026",
      ref: "ISW_REF_8A3F2C",
    },
    {
      id: "TXN-INT-0002",
      orderId: "ORD-2024-002",
      user: "Aisha Mohammed",
      avatar: "https://i.pravatar.cc/150?u=aisha",
      amount: "₦899,000",
      status: "success",
      method: "Bank Transfer",
      date: "Feb 12, 2026",
      ref: "ISW_REF_1B4D9E",
    },
    {
      id: "TXN-INT-0003",
      orderId: "ORD-2024-003",
      user: "John Bosco",
      avatar: "https://i.pravatar.cc/150?u=john",
      amount: "₦450,000",
      status: "success",
      method: "Card (**** 1234)",
      date: "Feb 14, 2026",
      ref: "ISW_REF_7C6F3A",
    },
    {
      id: "TXN-INT-0004",
      orderId: "ORD-2024-004",
      user: "Emeka Obi",
      avatar: "https://i.pravatar.cc/150?u=emeka",
      amount: "₦4,500,000",
      status: "pending",
      method: "USSD",
      date: "Mar 02, 2026",
      ref: "ISW_REF_2E8B4D",
    },
    {
      id: "TXN-INT-0005",
      orderId: "ORD-2024-005",
      user: "Mariam Bello",
      avatar: "https://i.pravatar.cc/150?u=mariam",
      amount: "₦640,000",
      status: "failed",
      method: "Card (**** 5678)",
      date: "Mar 05, 2026",
      ref: "ISW_REF_9F1C5E",
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "success":
        return "bg-[#ECFDF3] text-[#027A48]";
      case "pending":
        return "bg-[#FFFAEB] text-[#B54708]";
      case "failed":
        return "bg-[#FEF3F2] text-[#B42318]";
      default:
        return "bg-[#F2F4F7] text-[#344054]";
    }
  };

  const filtered =
    activeTab === "All"
      ? transactions
      : transactions.filter((t) => t.status === activeTab.toLowerCase());

  // Revenue chart — monthly
  const revenueData = {
    labels: ["Oct", "Nov", "Dec", "Jan", "Feb", "Mar"],
    datasets: [
      {
        label: "Revenue (₦)",
        data: [280000, 450000, 620000, 1200000, 6534000, 1089000],
        backgroundColor: "#1C6206",
        borderRadius: 4,
        barThickness: 36,
      },
    ],
  };

  const revenueOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#1D2939",
        padding: 10,
        cornerRadius: 8,
        titleFont: { size: 12, family: "Inter" },
        bodyFont: { size: 11, family: "Inter" },
        callbacks: {
          label: (ctx: any) => `₦${ctx.raw.toLocaleString()}`,
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, family: "Inter" }, color: "#98A2B3" },
      },
      y: {
        grid: { color: "#F2F4F7" },
        ticks: {
          font: { size: 11, family: "Inter" },
          color: "#98A2B3",
          callback: (val: any) => `₦${(val / 1000000).toFixed(1)}M`,
        },
        beginAtZero: true,
      },
    },
  };

  return (
    <AdminLayout title="Payments">
      <div className="space-y-5">
        {/* Payment Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Total revenue</p>
            <p className="text-[22px] font-semibold text-[#101828]">₦6.53M</p>
            <p className="text-[11px] text-[#12B76A] mt-0.5">+18% this month</p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">
              Successful payments
            </p>
            <p className="text-[22px] font-semibold text-[#027A48]">
              {transactions.filter((t) => t.status === "success").length}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Pending</p>
            <p className="text-[22px] font-semibold text-[#B54708]">
              {transactions.filter((t) => t.status === "pending").length}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Failed</p>
            <p className="text-[22px] font-semibold text-[#B42318]">
              {transactions.filter((t) => t.status === "failed").length}
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-5 rounded-xl border border-[#EAECF0]">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="text-[14px] font-semibold text-[#101828]">
                Revenue overview
              </h3>
              <p className="text-[12px] text-[#667085] mt-0.5">
                Monthly payment volume via Interswitch
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#EAECF0] rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#667085"
                strokeWidth="1.8"
              >
                <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
              </svg>
              <span className="text-[12px] text-[#667085]">Last 6 months</span>
            </div>
          </div>
          <div className="h-[260px]">
            <Bar data={revenueData} options={revenueOptions} />
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EAECF0] flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-[#101828]">
                Transactions
              </h3>
              <span className="text-[12px] px-2 py-0.5 rounded-full bg-[#F0FDF4] text-[#1C6206] font-medium flex items-center gap-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                Interswitch
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-0.5 bg-[#F9FAFB] rounded-lg border border-[#EAECF0]">
                {["All", "Success", "Pending", "Failed"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeTab === tab ? "bg-white text-[#344054] shadow-sm" : "text-[#667085]"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#EAECF0] text-[11px] text-[#667085]">
                <th className="px-5 py-2.5 font-medium">Transaction</th>
                <th className="px-5 py-2.5 font-medium">Customer</th>
                <th className="px-5 py-2.5 font-medium">Order</th>
                <th className="px-5 py-2.5 font-medium">Method</th>
                <th className="px-5 py-2.5 font-medium">Amount</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => (
                <tr
                  key={t.id}
                  className="border-b border-[#F2F4F7] last:border-0 hover:bg-[#F9FAFB] transition-colors"
                >
                  <td className="px-5 py-3">
                    <p className="text-[13px] font-medium text-[#101828]">
                      {t.id}
                    </p>
                    <p className="text-[10px] text-[#98A2B3]">Ref: {t.ref}</p>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={t.avatar}
                        className="w-7 h-7 rounded-full"
                        alt=""
                      />
                      <span className="text-[13px] text-[#344054]">
                        {t.user}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[#1C6206] font-medium">
                    {t.orderId}
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[#667085]">
                    {t.method}
                  </td>
                  <td className="px-5 py-3 text-[13px] font-medium text-[#101828]">
                    {t.amount}
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`text-[11px] font-medium px-2.5 py-0.5 rounded-full capitalize ${getStatusStyle(t.status)}`}
                    >
                      {t.status}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-[12px] text-[#667085]">
                    {t.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-3 border-t border-[#EAECF0] flex justify-between items-center text-[12px] text-[#667085]">
            <p>Showing {filtered.length} transactions</p>
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

export default AdminPayments;
