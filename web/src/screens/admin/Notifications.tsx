import AdminLayout from "../../components/admin/AdminLayout";
import { motion } from "framer-motion";

const AdminNotifications = () => {
  const notifications = [
    {
      id: 1,
      title: "New High-Value Order",
      message: "Order #ORD-9281 just placed — ₦899,000 for a Rotavator.",
      time: "2 min ago",
      type: "marketplace",
      isRead: false,
    },
    {
      id: 2,
      title: "Content Reported",
      message:
        "A post in the Community section was flagged for inappropriate content.",
      time: "15 min ago",
      type: "community",
      isRead: false,
    },
    {
      id: 3,
      title: "Database Backup Success",
      message:
        "System scheduled backup completed successfully for all user records.",
      time: "1 hour ago",
      type: "system",
      isRead: true,
    },
    {
      id: 4,
      title: "New Expert Application",
      message: "Dr. Adebayo O. has applied to join the expert advisory panel.",
      time: "3 hours ago",
      type: "users",
      isRead: true,
    },
    {
      id: 5,
      title: "Withdrawal Request",
      message:
        "Farmer Jamilu requested a withdrawal of ₦45,000 from his wallet.",
      time: "5 hours ago",
      type: "marketplace",
      isRead: true,
    },
  ];

  const getTypeStyle = (type: string) => {
    switch (type) {
      case "marketplace":
        return "bg-[#EFF8FF] text-[#175CD3]";
      case "community":
        return "bg-[#FEF3F2] text-[#B42318]";
      case "system":
        return "bg-[#ECFDF3] text-[#027A48]";
      case "users":
        return "bg-[#F9F5FF] text-[#6941C6]";
      default:
        return "bg-[#F2F4F7] text-[#344054]";
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "marketplace":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
            <path d="M3 6h18" />
            <path d="M16 10a4 4 0 0 1-8 0" />
          </svg>
        );
      case "community":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        );
      case "system":
        return (
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
        );
      case "users":
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout title="Notifications">
      <div className="max-w-3xl">
        <div className="bg-white rounded-xl border border-[#EAECF0] overflow-hidden">
          <div className="px-5 py-4 border-b border-[#EAECF0] flex justify-between items-center">
            <div>
              <h2 className="text-[14px] font-semibold text-[#101828]">
                Activity
              </h2>
              <p className="text-[12px] text-[#667085] mt-0.5">
                <span className="text-[#1C6206] font-medium">2 unread</span>{" "}
                notifications
              </p>
            </div>
            <button className="text-[12px] font-medium text-[#667085] hover:text-[#344054]">
              Mark all as read
            </button>
          </div>

          <div className="divide-y divide-[#F2F4F7]">
            {notifications.map((notif, index) => (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                key={notif.id}
                className={`px-5 py-4 flex gap-3 items-start hover:bg-[#F9FAFB] transition-colors cursor-pointer group ${!notif.isRead ? "bg-[#F9FAFB]" : ""}`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${getTypeStyle(notif.type)}`}
                >
                  {getIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-0.5">
                    <h3
                      className={`text-[13px] ${!notif.isRead ? "font-medium text-[#101828]" : "text-[#667085]"}`}
                    >
                      {notif.title}
                    </h3>
                    <span className="text-[11px] text-[#98A2B3] whitespace-nowrap ml-4">
                      {notif.time}
                    </span>
                  </div>
                  <p
                    className={`text-[12px] leading-relaxed ${!notif.isRead ? "text-[#475467]" : "text-[#98A2B3]"}`}
                  >
                    {notif.message}
                  </p>
                </div>

                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-[#1C6206] mt-2 flex-shrink-0"></span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminNotifications;
