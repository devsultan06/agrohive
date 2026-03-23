import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";

// Matches Prisma NotificationType enum: FOLLOW, LIKE, COMMENT, ORDER_UPDATE, PROMOTION, SYSTEM, WELCOME
const NOTIFICATION_TYPES = [
  {
    value: "PROMOTION",
    label: "Promotion",
    desc: "Sales, deals, and special offers",
  },
  {
    value: "SYSTEM",
    label: "System",
    desc: "Platform updates and maintenance",
  },
  {
    value: "WELCOME",
    label: "Welcome",
    desc: "Onboarding messages for new users",
  },
];

const AdminSendNotification = () => {
  const [notifType, setNotifType] = useState("PROMOTION");
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [isSending, setIsSending] = useState(false);

  const sentHistory = [
    {
      title: "Welcome to Agrohive!",
      type: "WELCOME",
      target: "New users",
      sent: "Mar 06, 2026",
      recipients: 42,
    },
    {
      title: "New products added to marketplace",
      type: "PROMOTION",
      target: "All users",
      sent: "Mar 04, 2026",
      recipients: 1284,
    },
    {
      title: "Scheduled maintenance: Mar 10",
      type: "SYSTEM",
      target: "All users",
      sent: "Mar 02, 2026",
      recipients: 1284,
    },
    {
      title: "Maize streak virus alert — Northern region",
      type: "SYSTEM",
      target: "All users",
      sent: "Feb 28, 2026",
      recipients: 1284,
    },
  ];

  const handleSend = () => {
    setIsSending(true);
    // Would POST to backend /notifications/send (create Notification for each user)
    setTimeout(() => {
      setIsSending(false);
      setTitle("");
      setMessage("");
    }, 1500);
  };

  return (
    <AdminLayout title="Send Notification">
      <div className="grid grid-cols-3 gap-5">
        {/* Compose form */}
        <div className="col-span-2">
          <div className="bg-white rounded-xl border border-[#EAECF0]">
            <div className="px-6 py-4 border-b border-[#EAECF0]">
              <h2 className="text-[14px] font-semibold text-[#101828]">
                Compose notification
              </h2>
              <p className="text-[12px] text-[#667085] mt-0.5">
                Send push notifications to app users. Maps to the Notification
                model.
              </p>
            </div>
            <div className="p-6 space-y-4">
              {/* NotificationType  */}
              <div>
                <label className="text-[12px] text-[#344054] font-medium mb-2 block">
                  Notification type
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {NOTIFICATION_TYPES.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setNotifType(type.value)}
                      className={`p-3 rounded-lg border text-left transition-all ${
                        notifType === type.value
                          ? "border-[#1C6206] bg-[#F0FDF4]"
                          : "border-[#EAECF0] hover:bg-[#F9FAFB]"
                      }`}
                    >
                      <p
                        className={`text-[12px] font-medium ${notifType === type.value ? "text-[#15803D]" : "text-[#344054]"}`}
                      >
                        {type.label}
                      </p>
                      <p className="text-[10px] text-[#98A2B3] mt-0.5">
                        {type.desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* title: string */}
              <div>
                <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 🎉 New products just dropped!"
                  className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206]"
                  style={{ fontFamily: "inherit" }}
                />
              </div>

              {/* message: string */}
              <div>
                <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="What do you want to tell users?"
                  className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px] focus:outline-none focus:ring-2 focus:ring-[#1C6206]/20 focus:border-[#1C6206] resize-none"
                  style={{ fontFamily: "inherit" }}
                />
              </div>

              {/* Target audience */}
              <div>
                <label className="text-[12px] text-[#344054] font-medium mb-1 block">
                  Send to
                </label>
                <select
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full px-3 py-2 border border-[#D0D5DD] rounded-lg text-[13px]"
                  style={{ fontFamily: "inherit" }}
                >
                  <option value="all">All users (1,284)</option>
                  <option value="verified">Verified users only</option>
                  <option value="new">New users (last 7 days)</option>
                </select>
              </div>
            </div>

            <div className="px-6 py-4 bg-[#F9FAFB] border-t border-[#EAECF0] flex justify-end gap-3">
              <button className="px-4 py-2 border border-[#D0D5DD] rounded-lg text-[13px] font-medium text-[#344054] hover:bg-[#F2F4F7]">
                Preview
              </button>
              <button
                onClick={handleSend}
                disabled={!title.trim() || !message.trim() || isSending}
                className={`px-4 py-2 rounded-lg text-[13px] font-medium transition-colors ${
                  title.trim() && message.trim() && !isSending
                    ? "bg-[#1C6206] text-white hover:bg-[#165005]"
                    : "bg-[#D0D5DD] text-[#98A2B3] cursor-not-allowed"
                }`}
              >
                {isSending ? "Sending..." : "Send notification"}
              </button>
            </div>
          </div>
        </div>

        {/* Sent history */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-[#EAECF0]">
            <div className="px-5 py-4 border-b border-[#EAECF0]">
              <h3 className="text-[14px] font-semibold text-[#101828]">
                Recently sent
              </h3>
            </div>
            <div className="divide-y divide-[#F2F4F7]">
              {sentHistory.map((n, i) => (
                <div key={i} className="px-5 py-3.5">
                  <div className="flex justify-between items-start mb-0.5">
                    <p className="text-[12px] font-medium text-[#101828]">
                      {n.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full ${
                        n.type === "PROMOTION"
                          ? "bg-[#F9F5FF] text-[#6941C6]"
                          : n.type === "WELCOME"
                            ? "bg-[#ECFDF3] text-[#027A48]"
                            : "bg-[#EFF8FF] text-[#175CD3]"
                      }`}
                    >
                      {n.type}
                    </span>
                    <span className="text-[10px] text-[#98A2B3]">{n.sent}</span>
                    <span className="text-[10px] text-[#98A2B3]">
                      · {n.recipients} users
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSendNotification;
