import AdminLayout from "../../components/admin/AdminLayout";
import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "../../services/admin/dashboardService";
import { productService } from "../../services/admin/productService";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Filler,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Filler,
  Legend,
);

const AdminDashboard = () => {
  const { data: generalStats, isLoading: generalLoading } = useQuery({
    queryKey: ["admin-dashboard-general"],
    queryFn: () => dashboardService.getGeneralStats(),
  });

  const { data: categoryStats = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["admin-dashboard-categories"],
    queryFn: () => dashboardService.getCategoryStats(),
  });

  const { data: recentUsers = [], isLoading: usersLoading } = useQuery({
    queryKey: ["admin-dashboard-recent-users"],
    queryFn: () => dashboardService.getRecentUsers(),
  });

  const { data: inventoryStats = [], isLoading: inventoryLoading } = useQuery({
    queryKey: ["admin-dashboard-inventory"],
    queryFn: () => productService.getInventoryStats(),
  });

  // Stats derived from live data
  const stats = [
    {
      label: "Total users",
      value: generalStats?.totalUsers?.toLocaleString() ?? "0",
      change: "Regular customers",
      up: true,
    },
    {
      label: "Revenue",
      value: `₦${generalStats?.totalRevenue?.toLocaleString() ?? "0"}`,
      change: "Successful sales",
      up: true,
    },
    {
      label: "Total orders",
      value: generalStats?.totalOrders?.toLocaleString() ?? "0",
      change: "Verified orders",
      up: true,
    },
    {
      label: "Community posts",
      value: generalStats?.totalPosts?.toLocaleString() ?? "0",
      change: "All-time posts",
      up: true,
    },
    {
      label: "Active listings",
      value: generalStats?.activeListings?.toLocaleString() ?? "0",
      change: "Items for sale",
      up: true,
    },
  ];

  // Dynamic bar chart data (Stock vs Sold)
  const barData = {
    labels:
      inventoryStats.length > 0
        ? inventoryStats.map((i: any) => i.name)
        : ["No data"],
    datasets: [
      {
        label: "Current Stock",
        data:
          inventoryStats.length > 0
            ? inventoryStats.map((i: any) => i.stock)
            : [0],
        backgroundColor: "#1C6206",
        borderRadius: 4,
        barThickness: 28,
      },
      {
        label: "Sold (all time)",
        data:
          inventoryStats.length > 0
            ? inventoryStats.map((i: any) => i.sold)
            : [0],
        backgroundColor: "#60A5FA",
        borderRadius: 4,
        barThickness: 28,
      },
    ],
  };

  const barOptions = {
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
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { size: 11, family: "Inter" }, color: "#98A2B3" },
      },
      y: {
        grid: { color: "#F2F4F7" },
        ticks: { font: { size: 11, family: "Inter" }, color: "#98A2B3" },
        beginAtZero: true,
      },
    },
  };

  // Live category data for doughnut
  const doughnutColors = [
    "#1C6206",
    "#FDB022",
    "#175CD3",
    "#6941C6",
    "#D44438",
  ];
  const totalCategoryProducts = categoryStats.reduce(
    (acc, curr) => acc + curr.count,
    0,
  );

  const doughnutData = {
    labels: categoryStats.map((c) => c.name),
    datasets: [
      {
        data:
          categoryStats.length > 0 ? categoryStats.map((c) => c.count) : [100],
        backgroundColor:
          categoryStats.length > 0
            ? categoryStats.map(
                (_, i) => doughnutColors[i % doughnutColors.length],
              )
            : ["#F2F4F7"],
        borderWidth: 0,
        cutout: "72%",
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
  };

  const activities = [
    {
      icon: "🛒",
      label: "System Active",
      desc: "Dashboard monitoring enabled",
      tag: "System",
      tagColor: "text-[#1C6206] bg-[#ECFDF3]",
    },
  ];

  return (
    <AdminLayout title="Dashboard">
      <div className="space-y-6">
        <div className="grid grid-cols-5 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0] relative overflow-hidden"
            >
              <p className="text-[12px] text-[#667085] mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-[22px] font-semibold text-[#101828]">
                  {stat.value}
                </span>
                <span className="text-[10px] text-[#98A2B3]">
                  {stat.change}
                </span>
              </div>
              {generalLoading && (
                <div className="absolute inset-0 bg-white/40 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white p-5 rounded-xl border border-[#EAECF0]">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-[14px] font-semibold text-[#101828]">
                Product inventory
              </h3>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#1C6206]"></span>
                  <span className="text-[11px] text-[#667085]">In stock</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#60A5FA]"></span>
                  <span className="text-[11px] text-[#667085]">Sold</span>
                </div>
              </div>
            </div>
            <div className="h-[280px]">
              <Bar data={barData} options={barOptions} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAECF0] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#101828] mb-4">
              Products by category
            </h3>
            <div className="h-[180px] flex items-center justify-center relative">
              <Doughnut data={doughnutData} options={doughnutOptions} />
              <div className="absolute text-center">
                <p className="text-[18px] font-semibold text-[#101828]">
                  {totalCategoryProducts}
                </p>
                <p className="text-[10px] text-[#98A2B3]">Total</p>
              </div>
              {categoriesLoading && (
                <div className="absolute inset-0 bg-white/40 animate-pulse rounded-full" />
              )}
            </div>
            <div className="mt-4 space-y-3 overflow-auto max-h-[140px] pr-1">
              {categoryStats.length === 0 && !categoriesLoading ? (
                <p className="text-[12px] text-[#667085] text-center pt-4">
                  No categories found
                </p>
              ) : (
                categoryStats.map((cat, i) => (
                  <div
                    key={cat.name}
                    className="flex items-center justify-between text-[12px]"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2 h-2 rounded-full"
                        style={{
                          background: doughnutColors[i % doughnutColors.length],
                        }}
                      ></span>
                      <span className="text-[#344054] truncate max-w-[100px]">
                        {cat.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[#98A2B3]">{cat.count}</span>
                      <span className="text-[#667085] font-medium">
                        {cat.percentage}%
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAECF0]">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-[14px] font-semibold text-[#101828]">
                Recent activity
              </h3>
            </div>
            <div className="space-y-4">
              {activities.map((a, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-[16px] mt-0.5">{a.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-medium text-[#344054] truncate">
                      {a.label}
                    </p>
                    <p className="text-[11px] text-[#98A2B3]">{a.desc}</p>
                  </div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${a.tagColor}`}
                  >
                    {a.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-2 bg-white rounded-xl border border-[#EAECF0] overflow-hidden flex flex-col min-h-[300px]">
            <div className="flex justify-between items-center p-5 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-[#101828]">
                  Recent users
                </h3>
                {usersLoading && (
                  <div className="w-3 h-3 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#EAECF0] text-[11px] text-[#667085] bg-[#FCFCFD]">
                    <th className="px-5 py-2.5 font-medium">User</th>
                    <th className="px-5 py-2.5 font-medium">Email</th>
                    <th className="px-5 py-2.5 font-medium">Status</th>
                    <th className="px-5 py-2.5 font-medium text-right">
                      Posts
                    </th>
                    <th className="px-5 py-2.5 font-medium text-right">
                      Favorites
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {recentUsers.length === 0 && !usersLoading ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-10 text-center text-[#667085] text-[12px]"
                      >
                        No recent users found
                      </td>
                    </tr>
                  ) : (
                    recentUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="hover:bg-[#F9FAFB] transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={
                                u.avatarUrl ||
                                `https://ui-avatars.com/api/?name=${u.fullName}&background=F3F4F6&color=667085`
                              }
                              className="w-8 h-8 rounded-full object-cover"
                              alt=""
                            />
                            <span className="text-[13px] font-medium text-[#101828]">
                              {u.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#667085]">
                          {u.email}
                        </td>
                        <td className="px-5 py-3">
                          {u.isVerified ? (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#ECFDF3] text-[#027A48]">
                              Verified
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#FFFAEB] text-[#B54708]">
                              Pending
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#667085] text-right">
                          {u._count.posts}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#667085] text-right">
                          {u._count.favorites}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
