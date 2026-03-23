import AdminLayout from "../../components/admin/AdminLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../../services/admin/userService";

const AdminUsers = () => {
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users", activeFilter, searchTerm],
    queryFn: () => {
      let verified: string | undefined;
      if (activeFilter === "Verified") verified = "true";
      if (activeFilter === "Unverified") verified = "false";

      return userService.admin_getAllUsers({
        verified,
        search: searchTerm || undefined,
      });
    },
  });

  return (
    <AdminLayout title="Users">
      <div className="space-y-5">
        <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden min-h-[500px] flex flex-col">
          <div className="px-5 py-4 border-b border-[#EAECF0] flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h3 className="text-[14px] font-semibold text-[#101828]">
                {activeFilter === "All" ? "All users" : activeFilter + " users"}
              </h3>
              <span className="text-[11px] font-medium bg-[#F2F4F7] text-[#344054] px-2 py-0.5 rounded-full">
                {users.length}
              </span>
              {isLoading && (
                <div className="w-3 h-3 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
              )}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 p-0.5 bg-[#F9FAFB] rounded-lg border border-[#EAECF0]">
                {["All", "Verified", "Unverified"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveFilter(tab)}
                    className={`px-3 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeFilter === tab ? "bg-white text-[#344054] shadow-sm" : "text-[#667085] hover:text-[#344054]"}`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F9FAFB] border border-[#EAECF0] rounded-lg w-48 focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1C6206]/10 focus-within:border-[#1C6206] transition-all">
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
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[12px] w-full text-[#101828] placeholder:text-[#98A2B3]"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#EAECF0] text-[11px] text-[#667085] bg-[#FCFCFD]">
                  <th className="px-5 py-2.5 font-medium">User</th>
                  <th className="px-5 py-2.5 font-medium">Username</th>
                  <th className="px-5 py-2.5 font-medium">Location</th>
                  <th className="px-5 py-2.5 font-medium">Status</th>
                  <th className="px-5 py-2.5 font-medium text-right">Posts</th>
                  <th className="px-5 py-2.5 font-medium text-right">
                    Followers
                  </th>
                  <th className="px-5 py-2.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F4F7]">
                {users.length === 0 && !isLoading ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-10 h-10 bg-[#F9FAFB] rounded-full flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#98A2B3"
                            strokeWidth="2"
                          >
                            <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <p className="text-[13px] font-medium text-[#101828]">
                          No users found
                        </p>
                        <p className="text-[11px] text-[#667085]">
                          Try adjusting your search or filters
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr
                      key={u.id}
                      className="hover:bg-[#F9FAFB] transition-colors group"
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
                          <div>
                            <p className="text-[13px] font-medium text-[#101828]">
                              {u.fullName}
                            </p>
                            <p className="text-[11px] text-[#98A2B3]">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#475467]">
                        @{u.username}
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#475467]">
                        {u.location || "N/A"}
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[11px] font-medium px-2.5 py-1 rounded-full border ${
                            u.isVerified
                              ? "bg-[#ECFDF3] text-[#027A48] border-[#ABEFC6]"
                              : "bg-[#FFFAEB] text-[#B54708] border-[#FEDF89]"
                          }`}
                        >
                          {u.isVerified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#475467] text-right">
                        {u._count?.posts || 0}
                      </td>
                      <td className="px-5 py-3 text-[12px] text-[#475467] text-right">
                        {u._count?.followers || 0}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <button className="p-1.5 text-[#667085] hover:text-[#1C6206] hover:bg-[#ECFDF3] rounded-md transition-all">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M5 12h14" />
                            <path d="M12 5l7 7-7 7" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-5 py-3 border-t border-[#EAECF0] flex justify-between items-center text-[12px] text-[#667085] bg-white">
            <p>Showing {users.length} users</p>
            <div className="flex gap-2">
              <button className="px-3 py-1.5 border border-[#D0D5DD] rounded-lg hover:bg-[#F9FAFB] text-[#344054] font-medium disabled:opacity-50 transition-colors">
                Previous
              </button>
              <button className="px-3 py-1.5 border border-[#D0D5DD] rounded-lg hover:bg-[#F9FAFB] text-[#344054] font-medium disabled:opacity-50 transition-colors">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
