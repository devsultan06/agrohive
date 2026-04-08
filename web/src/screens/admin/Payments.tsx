import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { orderService } from "../../services/admin/order.service";
import { dashboardService } from "../../services/admin/dashboard.service";
import dayjs from "dayjs";
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

  const { data: orders = [], isLoading: ordersLoading } = useQuery({
    queryKey: ["admin-all-orders"],
    queryFn: () => orderService.getAllOrders(),
  });

  const { data: generalStats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-dashboard-general"],
    queryFn: () => dashboardService.getGeneralStats(),
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-[#ECFDF3] text-[#027A48]";
      case "PENDING":
        return "bg-[#FFFAEB] text-[#B54708]";
      case "FAILED":
        return "bg-[#FEF3F2] text-[#B42318]";
      default:
        return "bg-[#F2F4F7] text-[#344054]";
    }
  };

  const filtered = orders
    .filter((t: any) =>
      activeTab === "All" ? true : t.paymentStatus === activeTab.toUpperCase(),
    )
    .map((t: any) => ({
      id: t.orderNumber || t.id.split("-")[0],
      orderId: t.id,
      user: t.user.fullName,
      avatar:
        t.user.avatarUrl ||
        `https://ui-avatars.com/api/?name=${t.user.fullName}&background=F3F4F6&color=667085`,
      amount: `₦${Number(t.totalAmount).toLocaleString()}`,
      status: t.paymentStatus,
      method: "Paystack",
      date: dayjs(t.createdAt).format("MMM DD, YYYY"),
      ref: t.paymentReference || "N/A",
    }));

  const revenueData = {
    labels: generalStats?.monthlyLabels || [
      "Oct",
      "Nov",
      "Dec",
      "Jan",
      "Feb",
      "Mar",
    ],
    datasets: [
      {
        label: "Revenue (₦)",
        data: generalStats?.monthlyRevenue || [0, 0, 0, 0, 0, 0],
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
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0] relative">
            <p className="text-[12px] text-[#667085] mb-0.5">Total revenue</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              ₦{generalStats?.totalRevenue?.toLocaleString() ?? "0"}
            </p>
            <p className="text-[11px] text-[#12B76A] mt-0.5">
              Live from Paystack
            </p>
            {statsLoading && (
              <div className="absolute inset-0 bg-white/40 animate-pulse rounded-xl" />
            )}
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">
              Successful payments
            </p>
            <p className="text-[22px] font-semibold text-[#027A48]">
              {orders.filter((t: any) => t.paymentStatus === "SUCCESS").length}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Pending</p>
            <p className="text-[22px] font-semibold text-[#B54708]">
              {orders.filter((t: any) => t.paymentStatus === "PENDING").length}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Failed</p>
            <p className="text-[22px] font-semibold text-[#B42318]">
              {orders.filter((t: any) => t.paymentStatus === "FAILED").length}
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
                Monthly payment volume via Paystack
              </p>
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
                Paystack
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
                <th className="px-5 py-2.5 font-medium">Order ID</th>
                <th className="px-5 py-2.5 font-medium">Method</th>
                <th className="px-5 py-2.5 font-medium">Amount</th>
                <th className="px-5 py-2.5 font-medium">Status</th>
                <th className="px-5 py-2.5 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {ordersLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center">
                    <div className="inline-block w-6 h-6 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
                    <p className="mt-2 text-[12px] text-[#667085]">
                      Loading transactions...
                    </p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-[#667085] text-[12px]"
                  >
                    No transactions found
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr
                    key={t.orderId}
                    className="border-b border-[#F2F4F7] last:border-0 hover:bg-[#F9FAFB] transition-colors"
                  >
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-medium text-[#101828]">
                        #{t.id}
                      </p>
                      <p className="text-[10px] text-[#98A2B3]">Ref: {t.ref}</p>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={t.avatar}
                          className="w-7 h-7 rounded-full border border-gray-100"
                          alt=""
                        />
                        <span className="text-[13px] text-[#344054]">
                          {t.user}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-[11px] text-[#667085] font-mono">
                      {t.orderId.substring(0, 8)}...
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
                        {t.status.toLowerCase()}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[12px] text-[#667085]">
                      {t.date}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPayments;
