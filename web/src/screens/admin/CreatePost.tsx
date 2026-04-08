import { useState, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { communityService } from "../../services/admin/community.service";
import { useNavigate } from "react-router-dom";

const AdminCreatePost = () => {
  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (variables: { content: string; image?: File | null }) =>
      communityService.createPost(variables.content, variables.image),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-community-posts"] });
      queryClient.invalidateQueries({ queryKey: ["admin-community-stats"] });
      navigate("/admin/community");
    },
    onSettled: () => setIsSubmitting(false),
  });

  const handlePublish = () => {
    if (!postContent.trim()) return;
    setIsSubmitting(true);
    createMutation.mutate({ content: postContent, image: selectedImage });
  };

  return (
    <AdminLayout title="Write Post">
      <div className="max-w-2xl">
        <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 border-b border-[#EAECF0]">
            <h2 className="text-[14px] font-semibold text-[#101828]">
              Create community post
            </h2>
            <p className="text-[12px] text-[#667085] mt-0.5">
              Write an announcement or farming tip. This will appear in the
              AgroConnect community feed.
            </p>
          </div>

          {/* Post Author */}
          <div className="px-6 py-4 border-b border-[#F2F4F7] flex items-center gap-3">
            <img
              src="https://ui-avatars.com/api/?name=SN&background=1C6206&color=fff&size=80&bold=true&font-size=0.4"
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-[13px] font-medium text-[#101828]">
                Sultan Nasir
              </p>
              <p className="text-[11px] text-[#98A2B3]">
                Admin · Posting as Agrohive
              </p>
            </div>
          </div>

          {/* Content area — matches Post schema: content field */}
          <div className="p-6">
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="What would you like to share with the community?"
              rows={8}
              className="w-full border-none outline-none text-[14px] text-[#101828] placeholder:text-[#98A2B3] resize-none leading-relaxed"
              style={{ fontFamily: "inherit" }}
            />
          </div>

          {/* Image upload — matches Post schema: imageUrl field */}
          <div className="px-6 pb-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="hidden"
              accept="image/*"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border border-dashed border-[#D0D5DD] rounded-lg p-4 text-center hover:bg-[#F9FAFB] cursor-pointer transition-colors"
            >
              <div className="flex items-center justify-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#98A2B3"
                  strokeWidth="1.8"
                >
                  <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                <span className="text-[12px] text-[#667085]">
                  {selectedImage ? selectedImage.name : "Add image to post"}
                </span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#EAECF0] flex justify-between items-center">
            <p className="text-[11px] text-[#98A2B3]">
              {postContent.length} characters
            </p>
            <div className="flex gap-3">
              <button className="px-4 py-2 border border-[#D0D5DD] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-[#F2F4F7]">
                Save as draft
              </button>
              <button
                onClick={handlePublish}
                disabled={!postContent.trim() || isSubmitting}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  postContent.trim() && !isSubmitting
                    ? "bg-[#1C6206] text-white hover:bg-[#165005]"
                    : "bg-[#D0D5DD] text-[#98A2B3] cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Publishing..." : "Publish post"}
              </button>
            </div>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-4 bg-[#F0FDF4] rounded-xl p-4 border border-[#BBF7D0]">
          <h3 className="text-[13px] font-medium text-[#15803D] mb-2">
            Writing tips
          </h3>
          <ul className="text-[12px] text-[#166534] space-y-1">
            <li>• Share seasonal farming advice relevant to your users</li>
            <li>• Include an image to get 3x more engagement</li>
            <li>• Keep posts under 280 characters for best readability</li>
            <li>• Use questions to encourage community discussion</li>
          </ul>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCreatePost;
