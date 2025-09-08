import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { Mail, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";

const MessagesPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recipient, setRecipient] = useState("all_users"); // Default to 'all_users'
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null,
  });

  const token = localStorage.getItem("adminToken");

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setAlert({ message: "", type: null });

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/message`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          subject,
          message,
          recipient,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send message.");
      }

      setAlert({ message: "Message sent successfully!", type: "success" });
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      console.error(err);
      setAlert({
        message:
          err instanceof Error
            ? err.message
            : "Failed to send message. Please try again.",
        type: "error",
      });
    } finally {
      setIsSending(false);
      setTimeout(() => setAlert({ message: "", type: null }), 5000);
    }
  };

  const getRecipientLabel = (value: string) => {
    switch (value) {
      case "all_users":
        return "All Users";
      case "customers_with_orders":
        return "Customers with Orders";
      case "reservations":
        return "Reservation Guests";
      default:
        return "Select Recipient";
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Mail className="w-8 h-8 text-rose-600" />
          Send a Message
        </h1>

        {/* Alert Box */}
        {alert.message && (
          <div
            className={`flex items-center gap-2 p-4 mb-6 rounded-xl ${
              alert.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
            role="alert"
          >
            {alert.type === "success" ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        )}

        <form onSubmit={handleSendEmail} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Email Composition Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Compose Message</h2>
            <div className="space-y-4">
              {/* Recipient Dropdown */}
              <div>
                <label htmlFor="recipient" className="block text-sm font-medium text-gray-700 mb-1">
                  Recipient
                </label>
                <select
                  id="recipient"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  required
                >
                  <option value="all_users">All Users</option>
                  <option value="customers_with_orders">Customers with Orders</option>
                  <option value="reservations">Reservation Guests</option>
                </select>
              </div>

              {/* Subject Line */}
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  placeholder="e.g., Your Weekly Special"
                  required
                />
              </div>

              {/* Message Body */}
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={8}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500 transition"
                  placeholder="Write your email content here..."
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className={`w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl font-bold transition-colors duration-200 ${
                  isSending
                    ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                    : "bg-rose-600 text-white hover:bg-rose-700"
                }`}
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Preview Section */}
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h2>
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-inner min-h-[400px]">
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500">To: </span>
                <span className="font-semibold text-gray-800">
                  {getRecipientLabel(recipient)}
                </span>
              </div>
              <div className="mb-4">
                <span className="text-sm font-medium text-gray-500">Subject: </span>
                <span className="font-semibold text-gray-800">
                  {subject || "Your Subject Here"}
                </span>
              </div>
              <div className="prose max-w-none text-gray-700">
                <p className="whitespace-pre-line">{message || "Your message will appear here as you type."}</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default MessagesPage;