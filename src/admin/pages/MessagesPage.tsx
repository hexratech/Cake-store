import { useState, useEffect } from "react";
import AdminLayout from "../components/AdminLayout";
import { Mail, Send, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface Recipient {
  _id: string;
  name: string;
  email?: string;
  selected?: boolean;
}

const MessagesPage = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" | null }>({
    message: "",
    type: null,
  });
  const [emails, setEmails] = useState<Recipient[]>([]);
  const [loadingEmails, setLoadingEmails] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [activeTab, setActiveTab] = useState<"compose" | "emails">("compose");

  const token = localStorage.getItem("adminToken");

  // Fetch all users with emails
  useEffect(() => {
    const fetchEmails = async () => {
      setLoadingEmails(true);
      setEmailError("");
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data: Recipient[] = await res.json();
        setEmails(
          data
            .filter((user) => user.email && user.email.includes("@"))
            .map((user) => ({ ...user, selected: true }))
        );
      } catch (err: unknown) {
        if (err instanceof Error) setEmailError(err.message);
        else setEmailError("Unknown error occurred");
      } finally {
        setLoadingEmails(false);
      }
    };
    fetchEmails();
  }, [token]);

  const toggleEmail = (id: string) => {
    setEmails((prev) =>
      prev.map((e) => (e._id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const toggleAllEmails = (selectAll: boolean) => {
    setEmails((prev) => prev.map((e) => ({ ...e, selected: selectAll })));
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setAlert({ message: "", type: null });

    const selectedEmails = emails.filter((e) => e.selected && e.email).map((e) => e.email);

    if (selectedEmails.length === 0) {
      setAlert({ message: "Please select at least one valid recipient", type: "error" });
      setIsSending(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/messages/bulk`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subject, message, recipients: selectedEmails }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to send message");
      }

      setAlert({ message: "Message sent successfully!", type: "success" });
      setSubject("");
      setMessage("");
    } catch (err: unknown) {
      setAlert({
        message: err instanceof Error ? err.message : "Failed to send message",
        type: "error",
      });
    } finally {
      setIsSending(false);
      setTimeout(() => setAlert({ message: "", type: null }), 5000);
    }
  };

  return (
    <AdminLayout>
      <div className="p-6 md:p-8 bg-white min-h-full rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
          <Mail className="w-8 h-8 text-rose-600" />
          Messages
        </h1>

        {alert.message && (
          <div
            className={`flex items-center gap-2 p-4 mb-6 rounded-xl ${
              alert.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
            role="alert"
          >
            {alert.type === "success" ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />}
            <span className="text-sm font-medium">{alert.message}</span>
          </div>
        )}

        <div className="flex mb-6 border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "compose" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("compose")}
          >
            Compose
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === "emails" ? "border-b-2 border-rose-600 text-rose-600" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("emails")}
          >
            Selected Emails ({emails.filter((e) => e.selected).length})
          </button>
        </div>

        {activeTab === "compose" ? (
          <form onSubmit={handleSendEmail} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Compose Message</h2>
              <div className="space-y-4">
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
                    isSending ? "bg-gray-400 text-gray-100 cursor-not-allowed" : "bg-rose-600 text-white hover:bg-rose-700"
                  }`}
                >
                  {isSending ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" /> Send Message
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Live Preview</h2>
              <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-inner min-h-[400px] flex flex-col gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">To: </span>
                  <span className="font-semibold text-gray-800">Selected Recipients</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Subject: </span>
                  <span className="font-semibold text-gray-800">{subject || "Your Subject Here"}</span>
                </div>
                <div className="prose max-w-none text-gray-700">
                  <p className="whitespace-pre-line">{message || "Your message will appear here as you type."}</p>
                </div>
              </div>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 min-h-[400px]">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Selected Emails ({emails.filter((e) => e.selected).length})
            </h2>

            {loadingEmails ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading emails...
              </div>
            ) : emailError ? (
              <div className="text-red-500 text-sm">{emailError}</div>
            ) : emails.length > 0 ? (
              <>
                <div className="mb-2 flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={emails.every((e) => e.selected)}
                      onChange={(e) => toggleAllEmails(e.target.checked)}
                      className="w-4 h-4"
                    />
                    Select All
                  </label>
                </div>
                <ul className="max-h-[400px] overflow-y-auto space-y-2 text-gray-700">
                  {emails.map((user) => (
                    <li key={user._id} className="flex items-center gap-2 border-b py-1">
                      <input
                        type="checkbox"
                        checked={user.selected}
                        onChange={() => toggleEmail(user._id)}
                        className="w-4 h-4"
                      />
                      <span>
                        {user.name} - <span className="font-mono">{user.email}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <div className="text-gray-400 text-sm">No emails found for this selection.</div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default MessagesPage;
