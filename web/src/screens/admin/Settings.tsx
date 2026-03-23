import { useState, useEffect, useRef } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/admin/userService";

const AdminSettings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const { data: user, isLoading: isFetching } = useQuery({
    queryKey: ["admin-profile"],
    queryFn: () => userService.getMe(),
  });

  // Use localStorage as initial fallback while fetching
  useEffect(() => {
    const cachedUser = JSON.parse(
      localStorage.getItem("agrohive_admin_user") || "{}",
    );
    if (cachedUser.fullName && !firstName && !lastName) {
      const parts = cachedUser.fullName.split(" ");
      setFirstName(parts[0] || "");
      setEmail(cachedUser.email || "");
      setLastName(parts.slice(1).join(" ") || "");
      setPhone(cachedUser.phone || "");
      setLocation(cachedUser.location || "");
      setImagePreview(cachedUser.avatarUrl);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const parts = user.fullName.split(" ");
      setFirstName(parts[0] || "");
      setLastName(parts.slice(1).join(" ") || "");
      setEmail(user.email || "");
      setPhone(user.phone || "");
      setLocation(user.location || "");
      setImagePreview(user.avatarUrl);
    }
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: (variables: { payload: any; file?: File }) =>
      userService.updateMe(variables.payload, variables.file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-profile"] });
      setSelectedImage(null);
      // You could add a toast notification here
    },
  });

  const handleSave = () => {
    const fullName = `${firstName} ${lastName}`.trim();
    const payload = {
      fullName,
      phone,
      location,
    };
    updateMutation.mutate({ payload, file: selectedImage || undefined });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const tabs = [
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
    {
      id: "platform",
      label: "Platform",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      ),
    },
    {
      id: "security",
      label: "Security",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
      ),
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
      ),
    },
  ];

  return (
    <AdminLayout title="Settings">
      <div className="bg-white rounded-xl border border-[#EAECF0] flex min-h-[600px]">
        <div className="w-56 border-r border-[#EAECF0] p-3">
          <div className="space-y-0.5">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-[13px] transition-colors ${activeTab === tab.id ? "bg-[#F0FDF4] text-[#15803D] font-medium" : "text-[#667085] hover:bg-[#F9FAFB]"}`}
              >
                <span
                  className={
                    activeTab === tab.id ? "text-[#15803D]" : "text-[#98A2B3]"
                  }
                >
                  {tab.icon}
                </span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8 relative">
          {isFetching && (
            <div className="absolute inset-0 bg-white/50 backdrop-blur-[1px] z-10 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-[#1C6206] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === "profile" && (
              <div className="max-w-lg space-y-6">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#101828]">
                    Personal info
                  </h2>
                  <p className="text-[13px] text-[#667085] mt-0.5">
                    Update your photo and personal details.
                  </p>
                </div>

                <div className="flex items-center gap-4 pb-6 border-b border-[#EAECF0]">
                  <img
                    src={
                      imagePreview ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName || "A")}&background=F3F4F6&color=344054&size=200&bold=true`
                    }
                    alt="Avatar"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[13px] font-medium text-[#1C6206] hover:underline"
                    >
                      Change photo
                    </button>
                    <p className="text-[11px] text-[#98A2B3] mt-0.5">
                      JPG, PNG · Max 5MB
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                        First name
                      </label>
                      <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206]"
                        style={{ fontFamily: "inherit" }}
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                        Last name
                      </label>
                      <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206]"
                        style={{ fontFamily: "inherit" }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                      Email
                    </label>
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="w-full px-3 py-2 border border-[#EAECF0] bg-[#F9FAFB] text-[#667085] rounded-lg text-[13px] cursor-not-allowed"
                      style={{ fontFamily: "inherit" }}
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAECF0] flex justify-end gap-3">
                  <button
                    onClick={() =>
                      queryClient.invalidateQueries({
                        queryKey: ["admin-profile"],
                      })
                    }
                    className="px-4 py-2 border border-[#D0D5DD] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-[#F9FAFB]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={updateMutation.isPending}
                    className="px-4 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium hover:bg-[#165005] flex items-center gap-2 disabled:opacity-70"
                  >
                    {updateMutation.isPending && (
                      <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    )}
                    Save changes
                  </button>
                </div>
              </div>
            )}

            {activeTab === "platform" && (
              <div className="max-w-lg space-y-6">
                <div>
                  <h2 className="text-[15px] font-semibold text-[#101828]">
                    Platform settings
                  </h2>
                  <p className="text-[13px] text-[#667085] mt-0.5">
                    Manage marketplace configuration.
                  </p>
                </div>
                {/* Platform settings mock remains visual but static for now */}
                <div className="space-y-5">
                  <div className="flex items-center justify-between p-4 bg-[#F9FAFB] rounded-lg border border-[#EAECF0]">
                    <div>
                      <p className="text-[13px] font-medium text-[#344054]">
                        Maintenance mode
                      </p>
                      <p className="text-[11px] text-[#98A2B3]">
                        Hide store from all users
                      </p>
                    </div>
                    <div className="w-11 h-6 bg-[#D0D5DD] rounded-full p-0.5 cursor-pointer">
                      <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                        Platform fee (%)
                      </label>
                      <input
                        type="number"
                        defaultValue="5"
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px]"
                        style={{ fontFamily: "inherit" }}
                      />
                    </div>
                    <div>
                      <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                        Currency
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px]"
                        style={{ fontFamily: "inherit" }}
                      >
                        <option>NGN (₦)</option>
                        <option>USD ($)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-[#EAECF0] flex justify-end">
                  <button className="px-4 py-2 bg-[#1C6206] text-white rounded-lg text-[13px] font-medium hover:bg-[#165005]">
                    Apply settings
                  </button>
                </div>
              </div>
            )}

            {activeTab !== "profile" && activeTab !== "platform" && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-12 h-12 bg-[#F2F4F7] rounded-full flex items-center justify-center mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#98A2B3"
                    strokeWidth="1.8"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                </div>
                <h3 className="text-[14px] font-semibold text-[#101828]">
                  Protected section
                </h3>
                <p className="text-[12px] text-[#667085] max-w-xs mt-1">
                  This section requires additional authorization to access.
                </p>
                <button className="mt-4 px-4 py-2 bg-[#101828] text-white rounded-lg text-[12px] font-medium hover:bg-[#1D2939]">
                  Authorize
                </button>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
