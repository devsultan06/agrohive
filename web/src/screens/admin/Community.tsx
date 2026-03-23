import AdminLayout from "../../components/admin/AdminLayout";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  communityService,
  type CommunityPost,
  type TopContributor,
} from "../../services/admin/communityService";
import { toast } from "react-hot-toast";

const AdminCommunity = () => {
  const [activeFilter, setActiveFilter] = useState("All Posts");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState("");
  const queryClient = useQueryClient();

  // Fetch Posts
  const { data: posts = [], isLoading: postsLoading } = useQuery({
    queryKey: ["admin-community-posts", activeFilter, searchQuery],
    queryFn: () =>
      communityService.getPosts({
        search: searchQuery,
        hasImage: activeFilter === "With Images",
        sortBy: activeFilter === "Most Liked" ? "likes" : undefined,
      }),
  });

  // Fetch Single Post Details (for modal)
  const { data: selectedPost, isLoading: detailsLoading } = useQuery({
    queryKey: ["admin-post-details", selectedPostId],
    queryFn: () =>
      selectedPostId ? communityService.getPost(selectedPostId) : null,
    enabled: !!selectedPostId,
  });

  // Fetch Stats
  const { data: stats } = useQuery({
    queryKey: ["admin-community-stats"],
    queryFn: () => communityService.getStats(),
  });

  // Fetch Top Contributors
  const { data: topContributors = [] } = useQuery({
    queryKey: ["admin-community-contributors"],
    queryFn: () => communityService.getTopContributors(),
  });

  // Mutations
  const deleteMutation = useMutation({
    mutationFn: (id: string) => communityService.deletePost(id),
    onSuccess: () => {
      toast.success("Post removed successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-community-stats"] });
    },
  });

  const commentMutation = useMutation({
    mutationFn: (variables: { postId: string; content: string }) =>
      communityService.addComment(variables.postId, variables.content),
    onSuccess: () => {
      toast.success("Comment added!");
      setCommentText("");
      queryClient.invalidateQueries({
        queryKey: ["admin-post-details", selectedPostId],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-community-posts"] });
    },
  });

  const handleDelete = (id: string) => {
    if (window.confirm("Remove this post?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleAddComment = () => {
    if (!commentText.trim() || !selectedPostId) return;
    commentMutation.mutate({ postId: selectedPostId, content: commentText });
  };

  return (
    <AdminLayout title="Community">
      <div className="grid grid-cols-3 gap-5">
        <div className="col-span-2 space-y-4">
          <div className="bg-white px-5 py-3.5 rounded-xl border border-[#EAECF0] flex justify-between items-center">
            <div className="flex items-center gap-1 p-0.5 bg-[#F9FAFB] rounded-lg border border-[#EAECF0]">
              {["All Posts", "With Images", "Most Liked"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-md text-[12px] font-medium transition-all ${activeFilter === tab ? "bg-white text-[#344054] shadow-sm" : "text-[#667085]"}`}
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
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent border-none outline-none text-[12px] w-full text-[#667085]"
              />
            </div>
          </div>

          {postsLoading ? (
            <div className="bg-white p-10 rounded-xl border border-[#EAECF0] flex justify-center">
              <div className="w-8 h-8 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            posts.map((post: CommunityPost) => (
              <div
                key={post.id}
                className="bg-white p-5 rounded-xl border border-[#EAECF0] hover:border-[#D0D5DD] transition-colors"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={
                        post.user.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${post.user.fullName}`
                      }
                      className="w-9 h-9 rounded-full"
                      alt=""
                    />
                    <div>
                      <p className="text-[13px] font-medium text-[#101828]">
                        {post.user.fullName}
                      </p>
                      <p className="text-[11px] text-[#98A2B3]">Recently</p>
                    </div>
                  </div>
                  {post.imageUrl && (
                    <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EFF8FF] text-[#175CD3]">
                      📷 Has image
                    </span>
                  )}
                </div>
                <p className="text-[13px] text-[#475467] leading-relaxed mb-4">
                  {post.content}
                </p>

                {post.imageUrl && (
                  <div className="mb-4 rounded-lg overflow-hidden max-h-64 bg-gray-50 border border-gray-100 flex justify-center items-center">
                    <img
                      src={post.imageUrl}
                      className="max-w-full max-h-64 object-contain"
                      alt=""
                    />
                  </div>
                )}

                <div className="flex justify-between items-center pt-3 border-t border-[#F2F4F7]">
                  <div className="flex gap-5 text-[#98A2B3]">
                    <div className="flex items-center gap-1.5 text-[12px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                      </svg>
                      {post.likesCount}
                    </div>
                    <div className="flex items-center gap-1.5 text-[12px]">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      {post.commentsCount}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedPostId(post.id)}
                      className="text-[11px] font-medium text-[#1C6206] px-3 py-1.5 rounded-md bg-[#F0FDF4] hover:bg-[#DCFCE7] transition-all"
                    >
                      View Comments
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="text-[11px] font-medium text-[#F04438] px-2.5 py-1 rounded-md hover:bg-[#FEF3F2]"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-[#EAECF0]">
            <h3 className="text-[14px] font-semibold text-[#101828] mb-4">
              Community stats
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-[#F9FAFB] rounded-lg">
                <span className="text-[13px] text-[#667085]">Total posts</span>
                <span className="text-[13px] font-semibold text-[#344054]">
                  {stats?.totalPosts?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F9FAFB] rounded-lg">
                <span className="text-[13px] text-[#667085]">Total likes</span>
                <span className="text-[13px] font-semibold text-[#D92D20]">
                  {stats?.totalLikes?.toLocaleString() || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-[#F9FAFB] rounded-lg">
                <span className="text-[13px] text-[#667085]">
                  Total comments
                </span>
                <span className="text-[13px] font-semibold text-[#175CD3]">
                  {stats?.totalComments?.toLocaleString() || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-[#EAECF0]">
            <h3 className="text-[14px] font-semibold text-[#101828] mb-3">
              Top contributors
            </h3>
            <div className="space-y-3">
              {topContributors.map((u: TopContributor) => (
                <div key={u.id} className="flex items-center gap-2.5">
                  <img
                    src={
                      u.avatarUrl ||
                      `https://ui-avatars.com/api/?name=${u.fullName}`
                    }
                    className="w-7 h-7 rounded-full"
                    alt=""
                  />
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-[#344054]">
                      {u.fullName}
                    </p>
                    <p className="text-[11px] text-[#98A2B3]">
                      {u.postsCount} posts
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Post Details Modal */}
      {selectedPostId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-4 border-b border-[#EAECF0] flex justify-between items-center bg-[#F9FAFB]">
              <h3 className="text-[15px] font-bold text-[#101828]">
                Conversation Thread
              </h3>
              <button
                onClick={() => setSelectedPostId(null)}
                className="p-1.5 hover:bg-gray-200 rounded-full transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#667085"
                  strokeWidth="2.5"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {detailsLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="w-8 h-8 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                selectedPost && (
                  <>
                    {/* Original Post */}
                    <div className="flex gap-3">
                      <img
                        src={
                          selectedPost.user.avatarUrl ||
                          `https://ui-avatars.com/api/?name=${selectedPost.user.fullName}`
                        }
                        className="w-9 h-9 rounded-full"
                        alt=""
                      />
                      <div>
                        <div className="bg-[#F9FAFB] p-3.5 rounded-2xl rounded-tl-none border border-[#EAECF0]">
                          <p className="text-[13px] font-bold text-[#101828] mb-1">
                            {selectedPost.user.fullName}
                          </p>
                          <p className="text-[13px] text-[#475467] leading-relaxed">
                            {selectedPost.content}
                          </p>
                        </div>
                        <p className="text-[10px] text-[#98A2B3] mt-1.5 ml-1 font-bold">
                          OP · FEW MINS AGO
                        </p>
                      </div>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-4 pt-4">
                      <h4 className="text-[11px] font-extrabold text-[#98A2B3] uppercase tracking-widest pl-1">
                        Responses ({selectedPost.comments?.length || 0})
                      </h4>
                      {selectedPost.comments?.length === 0 ? (
                        <p className="text-[#98A2B3] text-[13px] italic text-center py-4 bg-gray-50 rounded-xl">
                          Be the first to share your expert advice!
                        </p>
                      ) : (
                        selectedPost.comments.map((c: any) => (
                          <div key={c.id} className="flex gap-3">
                            <img
                              src={
                                c.user.avatarUrl ||
                                `https://ui-avatars.com/api/?name=${c.user.fullName}`
                              }
                              className="w-8 h-8 rounded-full border border-gray-100"
                              alt=""
                            />
                            <div>
                              <div className="bg-white p-3 rounded-2xl rounded-tl-none border border-[#EAECF0]">
                                <p className="text-[12px] font-bold text-[#101828] mb-1">
                                  {c.user.fullName}
                                </p>
                                <p className="text-[12px] text-[#475467]">
                                  {c.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </>
                )
              )}
            </div>

            {/* Add Comment Section */}
            <div className="p-4 bg-white border-t border-[#EAECF0] flex items-center gap-3">
              <img
                src="https://ui-avatars.com/api/?name=SN&background=1C6206&color=fff"
                className="w-8 h-8 rounded-full"
                alt=""
              />
              <div className="flex-1 flex items-center gap-2 px-3 py-2 bg-[#F9FAFB] border border-[#EAECF0] rounded-xl group focus-within:bg-white focus-within:ring-2 focus-within:ring-[#1C6206]/10 focus-within:border-[#1C6206] transition-all">
                <input
                  type="text"
                  placeholder="Share an expert tip..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleAddComment()}
                  className="flex-1 bg-transparent border-none outline-none text-[13px] text-[#344054]"
                />
                <button
                  onClick={handleAddComment}
                  disabled={!commentText.trim() || commentMutation.isPending}
                  className={`p-1.5 rounded-lg transition-all ${commentText.trim() ? "bg-[#1C6206] text-white shadow-md shadow-[#1C6206]/20" : "text-[#98A2B3] opacity-50"}`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <path d="m5 12 7-7 7 7" />
                    <path d="M12 19V5" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCommunity;
