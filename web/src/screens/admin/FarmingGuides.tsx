import { useState, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  guideService,
  type FarmingGuide,
} from "../../services/admin/guideService";

const AdminFarmingGuides = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState<FarmingGuide | null>(null);
  const [playingVideo, setPlayingVideo] = useState<FarmingGuide | null>(null);
  const [localSearch, setLocalSearch] = useState("");
  const queryClient = useQueryClient();

  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbInputRef = useRef<HTMLInputElement>(null);

  const { data: guides = [], isLoading } = useQuery({
    queryKey: ["admin-guides", localSearch],
    queryFn: () => guideService.getGuides({ search: localSearch }),
  });

  const { data: stats } = useQuery({
    queryKey: ["admin-guides-stats"],
    queryFn: () => guideService.getStats(),
  });

  const createMutation = useMutation({
    mutationFn: (variables: { payload: any; video?: File; thumbnail?: File }) =>
      guideService.createGuide(
        variables.payload,
        variables.video,
        variables.thumbnail,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-guides"] });
      queryClient.invalidateQueries({ queryKey: ["admin-guides-stats"] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: (variables: {
      id: string;
      payload: any;
      video?: File;
      thumbnail?: File;
    }) =>
      guideService.updateGuide(
        variables.id,
        variables.payload,
        variables.video,
        variables.thumbnail,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-guides"] });
      setShowAddModal(false);
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => guideService.deleteGuide(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-guides"] });
      queryClient.invalidateQueries({ queryKey: ["admin-guides-stats"] });
    },
  });

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDuration("");
    setSelectedVideo(null);
    setSelectedThumbnail(null);
    setThumbnailPreview(null);
    setEditingGuide(null);
  };

  const handleEdit = (guide: FarmingGuide) => {
    setEditingGuide(guide);
    setTitle(guide.title);
    setDescription(guide.description);
    setDuration(guide.duration || "");
    setThumbnailPreview(guide.thumbnailUrl);
    setShowAddModal(true);
  };

  const handleSave = () => {
    const payload = { title, description, duration };
    if (editingGuide) {
      updateMutation.mutate({
        id: editingGuide.id,
        payload,
        video: selectedVideo || undefined,
        thumbnail: selectedThumbnail || undefined,
      });
    } else {
      createMutation.mutate({
        payload,
        video: selectedVideo || undefined,
        thumbnail: selectedThumbnail || undefined,
      });
    }
  };

  return (
    <AdminLayout title="Farming Guides">
      <div className="space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Total videos</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {stats?.totalVideos || 0}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Total views</p>
            <p className="text-[22px] font-semibold text-[#101828]">
              {stats?.totalViews?.toLocaleString() || 0}
            </p>
          </div>
          <div className="bg-white px-5 py-4 rounded-xl border border-[#EAECF0]">
            <p className="text-[12px] text-[#667085] mb-0.5">Published</p>
            <p className="text-[22px] font-semibold text-[#1C6206]">
              {stats?.published || 0}
            </p>
          </div>
        </div>

        {/* Header Container */}
        <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden relative min-h-[500px] flex flex-col">
          {/* Toolbar */}
          <div className="px-5 py-4 border-b border-[#EAECF0] flex justify-between items-center bg-[#F9FAFB]/30">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#EAECF0] rounded-lg w-64 shadow-sm">
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
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="Search guides..."
                className="bg-transparent border-none outline-none text-[12px] w-full text-[#101828] placeholder-[#98A2B3]"
              />
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium hover:bg-[#165005] transition-all shadow-sm"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <path d="M5 12h14" />
                <path d="M12 5v14" />
              </svg>
              Upload video
            </button>
          </div>

          {/* Content Area */}
          <div className="p-5 flex-1 relative">
            {isLoading && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-20 flex items-center justify-center">
                <div className="w-8 h-8 border-3 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
              </div>
            )}

            {guides.length === 0 && !isLoading ? (
              <div className="h-full py-24 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 bg-[#F9FAFB] rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#D0D5DD"
                    strokeWidth="1.5"
                  >
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect width="15" height="14" x="1" y="5" rx="2" ry="2" />
                  </svg>
                </div>
                <h3 className="text-[16px] font-semibold text-[#101828] mb-1">
                  {localSearch
                    ? "No guides match your search"
                    : "No farming guides yet"}
                </h3>
                <p className="text-[13px] text-[#667085] max-w-[320px] mb-6">
                  {localSearch
                    ? "Try adjusting your search terms or filters to find what you're looking for."
                    : "You haven't uploaded any tutorial videos yet. Start by uploading a guide for the farmers."}
                </p>
                {!localSearch && (
                  <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium hover:bg-[#165005]"
                  >
                    Upload your first guide
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-5">
                {guides.map((guide: FarmingGuide) => (
                  <div
                    key={guide.id}
                    className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden group hover:border-[#D0D5DD] transition-all hover:shadow-md h-fit"
                  >
                    <div className="relative h-44 bg-[#F2F4F7] flex items-center justify-center">
                      {guide.thumbnailUrl ? (
                        <img
                          src={guide.thumbnailUrl}
                          className="w-full h-full object-cover"
                          alt=""
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center opacity-40">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#1C6206"
                            strokeWidth="1.5"
                          >
                            <path d="m22 8-6 4 6 4V8Z" />
                            <rect
                              width="14"
                              height="12"
                              x="2"
                              y="6"
                              rx="2"
                              ry="2"
                            />
                          </svg>
                          <span className="text-[10px] mt-2 font-medium text-[#1C6206]">
                            No Thumbnail
                          </span>
                        </div>
                      )}
                      {/* Play Overlay */}
                      <div
                        onClick={() => setPlayingVideo(guide)}
                        className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-[1px]"
                      >
                        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-lg">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="#1C6206"
                            stroke="none"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] font-medium px-2 py-0.5 rounded backdrop-blur-sm z-10">
                        {guide.duration || "0:00"}
                      </span>
                    </div>
                    <div className="p-4">
                      <h3 className="text-[14px] font-semibold text-[#101828] mb-1 line-clamp-1">
                        {guide.title}
                      </h3>
                      <p className="text-[11px] text-[#667085] line-clamp-2 leading-relaxed h-8 mb-4">
                        {guide.description}
                      </p>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-[#F2F4F7]">
                        <div className="flex items-center gap-1.5 bg-[#F9FAFB] px-2 py-0.5 rounded-full border border-[#EAECF0]">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#98A2B3"
                            strokeWidth="2"
                          >
                            <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                            <circle cx="12" cy="12" r="3" />
                          </svg>
                          <span className="text-[11px] text-[#667085]">
                            {guide.views.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => handleEdit(guide)}
                            title="Edit"
                            className="p-1.5 text-[#667085] hover:text-[#1C6206] hover:bg-[#F0FDF4] rounded-md transition-colors border border-transparent hover:border-[#F2F4F7]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            >
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                            </svg>
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm("Delete guide?"))
                                deleteMutation.mutate(guide.id);
                            }}
                            title="Delete"
                            className="p-1.5 text-[#667085] hover:text-[#D92D20] hover:bg-[#FEF3F2] rounded-md transition-colors border border-transparent hover:border-[#F2F4F7]"
                          >
                            {deleteMutation.isPending &&
                            deleteMutation.variables === guide.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-[#D92D20]/20 border-t-[#D92D20] rounded-full animate-spin" />
                            ) : (
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M3 6h18" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 📹 Web Video Player Modal */}
      <AnimatePresence>
        {playingVideo && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setPlayingVideo(null)}
              className="fixed inset-0 bg-[#101828]/90 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-black rounded-2xl w-full max-w-4xl relative z-10 shadow-2xl overflow-hidden aspect-video flex flex-col"
            >
              <div className="absolute top-4 right-4 z-20 flex gap-2">
                <button
                  onClick={() => setPlayingVideo(null)}
                  className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center backdrop-blur-md transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>

              <video
                src={playingVideo.videoUrl}
                controls
                autoPlay
                className="w-full h-full object-contain"
              />

              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent pointer-events-none">
                <h2 className="text-white text-[18px] font-bold mb-1">
                  {playingVideo.title}
                </h2>
                <p className="text-white/60 text-[13px] line-clamp-1">
                  {playingVideo.description}
                </p>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Upload Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddModal(false)}
              className="fixed inset-0 bg-[#101828]/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              className="bg-white rounded-xl w-full max-w-lg relative z-10 shadow-xl overflow-hidden my-auto"
            >
              <div className="px-6 py-4 border-b border-[#EAECF0] flex justify-between items-center">
                <h2 className="text-[15px] font-semibold text-[#101828]">
                  {editingGuide ? "Edit Guide" : "Upload farming guide"}
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="text-[#98A2B3] hover:text-[#F04438] transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M18 6 6 18" />
                    <path d="m6 6 12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                    Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter video title"
                    className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206]"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="What describes this video..."
                    className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206] resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Duration (e.g. 4:32)
                    </label>
                    <input
                      type="text"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      placeholder="0:00"
                      className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px]"
                    />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Video File
                    </label>
                    <div
                      onClick={() => videoInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D0D5DD] rounded-lg p-4 text-center cursor-pointer hover:bg-[#F9FAFB] transition-colors"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="#98A2B3"
                        strokeWidth="2"
                        className="mx-auto mb-1"
                      >
                        <path d="M23 7 16 12 23 17 23 7" />
                        <rect
                          width="15"
                          height="14"
                          x="1"
                          y="5"
                          rx="2"
                          ry="2"
                        />
                      </svg>
                      <p className="text-[10px] text-[#667085] font-medium truncate">
                        {selectedVideo ? selectedVideo.name : "Select MP4/MOV"}
                      </p>
                      <input
                        type="file"
                        ref={videoInputRef}
                        className="hidden"
                        accept="video/*"
                        onChange={(e) =>
                          setSelectedVideo(e.target.files?.[0] || null)
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Thumbnail
                    </label>
                    <div
                      onClick={() => thumbInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D0D5DD] rounded-lg p-4 text-center cursor-pointer hover:bg-[#F9FAFB] transition-colors relative overflow-hidden h-[74px] flex flex-col items-center justify-center"
                    >
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          className="absolute inset-0 w-full h-full object-cover opacity-40"
                        />
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#98A2B3"
                          strokeWidth="2"
                          className="mx-auto mb-1"
                        >
                          <rect
                            width="18"
                            height="18"
                            x="3"
                            y="3"
                            rx="2"
                            ry="2"
                          />
                          <circle cx="9" cy="9" r="2" />
                          <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                        </svg>
                      )}
                      <p className="text-[10px] text-[#667085] font-medium relative z-10 truncate w-full px-2">
                        {selectedThumbnail
                          ? selectedThumbnail.name
                          : "Select JPG"}
                      </p>
                      <input
                        type="file"
                        ref={thumbInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setSelectedThumbnail(file);
                            setThumbnailPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#EAECF0] flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-4 py-2 border border-[#D0D5DD] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={
                    createMutation.isPending || updateMutation.isPending
                  }
                  className="px-4 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium flex items-center gap-2 hover:bg-[#165005] transition-all disabled:opacity-70"
                >
                  {(createMutation.isPending || updateMutation.isPending) && (
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  )}
                  {editingGuide ? "Update Guide" : "Publish Guide"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminLayout>
  );
};

export default AdminFarmingGuides;
