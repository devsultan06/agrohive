import AdminLayout from "../../components/admin/AdminLayout";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { reviewService } from "../../services/admin/reviewService";

const AdminReviews = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-review-stats"],
    queryFn: () => reviewService.getAdminStats(),
  });

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ["admin-reviews", searchTerm],
    queryFn: () => reviewService.getAllReviews(searchTerm || undefined),
  });

  const { data: topFavorites = [], isLoading: topFavoritesLoading } = useQuery({
    queryKey: ["admin-top-favorites"],
    queryFn: () => reviewService.getMostFavorited(4),
  });

  return (
    <AdminLayout title="Reviews & Favorites">
      <div className="space-y-5">
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0] relative overflow-hidden">
            <p className="text-[12px] text-[#667085] mb-0.5">Total reviews</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {stats?.totalReviews ?? 0}
            </p>
            {statsLoading && (
              <div className="absolute inset-0 bg-white/50 animate-pulse" />
            )}
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0] relative overflow-hidden">
            <p className="text-[12px] text-[#667085] mb-0.5">Avg. rating</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {stats?.avgRating ?? "0.0"}{" "}
              <span className="text-[#FDB022]">⭐</span>
            </p>
            {statsLoading && (
              <div className="absolute inset-0 bg-white/50 animate-pulse" />
            )}
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0] relative overflow-hidden">
            <p className="text-[12px] text-[#667085] mb-0.5">Total favorites</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {stats?.totalFavorites ?? 0}
            </p>
            {statsLoading && (
              <div className="absolute inset-0 bg-white/50 animate-pulse" />
            )}
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0] relative overflow-hidden">
            <p className="text-[12px] text-[#667085] mb-0.5">
              Products reviewed
            </p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {stats?.productsReviewed ?? 0} / {stats?.totalProducts ?? 0}
            </p>
            {statsLoading && (
              <div className="absolute inset-0 bg-white/50 animate-pulse" />
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 bg-white rounded-xl border border-[#EAECF0] overflow-hidden flex flex-col min-h-[400px]">
            <div className="px-5 py-4 border-b border-[#EAECF0] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <h3 className="text-[14px] font-semibold text-[#101828]">
                  Recent reviews
                </h3>
                {reviewsLoading && (
                  <div className="w-3 h-3 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
                )}
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
                  placeholder="Search reviews..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent border-none outline-none text-[12px] w-full text-[#101828] placeholder:text-[#98A2B3]"
                  style={{ fontFamily: "inherit" }}
                />
              </div>
            </div>
            <div className="flex-1 overflow-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#EAECF0] text-[11px] text-[#667085] bg-[#FCFCFD]">
                    <th className="px-5 py-2.5 font-medium">User</th>
                    <th className="px-5 py-2.5 font-medium">Product</th>
                    <th className="px-5 py-2.5 font-medium">Rating</th>
                    <th className="px-5 py-2.5 font-medium">Comment</th>
                    <th className="px-5 py-2.5 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F4F7]">
                  {reviews.length === 0 && !reviewsLoading ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-20 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <p className="text-[13px] font-medium text-[#101828]">
                            No reviews yet
                          </p>
                          <p className="text-[11px] text-[#667085]">
                            Customer feedback will appear here
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    reviews.map((r) => (
                      <tr
                        key={r.id}
                        className="hover:bg-[#F9FAFB] transition-colors"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2">
                            <img
                              src={
                                r.user.avatarUrl ||
                                `https://ui-avatars.com/api/?name=${r.user.fullName}&background=F3F4F6&color=667085`
                              }
                              className="w-7 h-7 rounded-full object-cover"
                              alt=""
                            />
                            <span className="text-[13px] font-medium text-[#101828]">
                              {r.user.fullName}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#475467]">
                          {r.product.name}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <span
                                key={i}
                                className={`text-[12px] ${i < r.rating ? "text-[#FDB022]" : "text-[#EAECF0]"}`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </td>
                        <td
                          className="px-5 py-3 text-[12px] text-[#667085] max-w-[200px] truncate"
                          title={r.comment || ""}
                        >
                          {r.comment || "No comment provided"}
                        </td>
                        <td className="px-5 py-3 text-[12px] text-[#98A2B3]">
                          {new Date(r.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAECF0] flex flex-col">
            <h3 className="text-[14px] font-semibold text-[#101828] mb-4">
              Most favorited products
            </h3>
            <div className="space-y-4 flex-1">
              {topFavoritesLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex gap-3 animate-pulse">
                    <div className="w-5 h-5 bg-[#F2F4F7] rounded mr-2" />
                    <div className="w-9 h-9 bg-[#F2F4F7] rounded-lg" />
                    <div className="flex-1 space-y-1">
                      <div className="h-3 bg-[#F2F4F7] rounded w-2/3" />
                      <div className="h-2 bg-[#F2F4F7] rounded w-1/3" />
                    </div>
                  </div>
                ))
              ) : topFavorites.length === 0 ? (
                <p className="text-[12px] text-[#667085] text-center pt-10">
                  No favorites data yet
                </p>
              ) : (
                topFavorites.map((f, i) => (
                  <div
                    key={f.id}
                    className="flex items-center gap-3 group transition-all"
                  >
                    <span className="text-[14px] font-semibold text-[#98A2B3] w-5">
                      #{i + 1}
                    </span>
                    <img
                      src={f.imageUrl || ""}
                      className="w-9 h-9 rounded-lg object-cover bg-[#F9FAFB] border border-[#EAECF0]"
                      alt=""
                    />
                    <div className="flex-1">
                      <p className="text-[13px] font-medium text-[#344054] group-hover:text-[#1C6206] transition-colors">
                        {f.name}
                      </p>
                      <p className="text-[11px] text-[#98A2B3]">
                        {f.favoritesCount}{" "}
                        {f.favoritesCount === 1 ? "user" : "users"} favorited
                      </p>
                    </div>
                    <span className="text-[12px] animate-pulse">❤️</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminReviews;
