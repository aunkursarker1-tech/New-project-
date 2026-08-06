import React, { useState } from 'react';
import { MessageSquare, MessageCircle, X, Send, Sparkles, Bot, Phone } from 'lucide-react';

interface LiveChatWidgetProps {
  darkMode: boolean;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ darkMode }) => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<
    { sender: 'user' | 'bot'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: 'Assalamu Alaikum! Welcome to Gadgetghor BD. How can I help you choose authentic gadgets today?',
      time: 'Just now',
    },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const userText = inputMsg;
    setMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' },
    ]);
    setInputMsg('');

    // Simulated AI Bot response
    setTimeout(() => {
      let botResponse =
        'Thank you for reaching out! All products at Gadgetghor BD carry 100% official brand warranty with 24-hour express delivery in Dhaka City and 2-3 days across all 64 districts in Bangladesh.';

      const lower = userText.toLowerCase();
      if (lower.includes('bkash') || lower.includes('payment') || lower.includes('pay')) {
        botResponse =
          'We accept bKash, Nagad, Visa/Mastercard cards, and 100% Cash on Delivery (COD)! Enter coupon code BKASH200 for ৳200 flat discount on bKash payments.';
      } else if (lower.includes('delivery') || lower.includes('dhaka') || lower.includes('shipping')) {
        botResponse =
          'Inside Dhaka City delivery fee is ৳60 (Free on orders above ৳2,000!). Outside Dhaka shipping fee is ৳120 via Steadfast/Pathao Courier.';
      } else if (lower.includes('warranty') || lower.includes('replacement')) {
        botResponse =
          'All products carry official manufacturer warranty (6 Months to 1 Year). We offer a 7 Days Easy Replacement guarantee for hardware defects!';
      } else if (lower.includes('stock') || lower.includes('location') || lower.includes('store')) {
        botResponse =
          'Our main outlet store is at Multiplan Center, Level 4, Elephant Road, Dhaka! You can also order online for instant home delivery.';
      }

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: botResponse, time: 'Just now' },
      ]);
    }, 800);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      {/* Expanded Chat Box */}
      {chatOpen && (
        <div
          className={`w-80 sm:w-96 rounded-3xl shadow-2xl border flex flex-col overflow-hidden transition-all duration-300 ${
            darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          {/* Chat Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 p-4 border-b border-emerald-900/40 flex items-center justify-between text-white">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-xs flex items-center gap-1">
                  Gadgetghor AI Assistant <Sparkles className="w-3 h-3 text-amber-400" />
                </h4>
                <p className="text-[10px] text-emerald-400 font-medium">● Online 24/7 Support</p>
              </div>
            </div>

            <button
              onClick={() => setChatOpen(false)}
              className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Direct WhatsApp / Messenger Quick Bar */}
          <div className="bg-slate-950/80 p-2 border-b border-slate-800 flex items-center justify-around text-[10px] font-bold">
            <a
              href="https://wa.me/8801700000000"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:underline"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400" /> WhatsApp Direct
            </a>
            <span className="text-slate-700">|</span>
            <span className="text-slate-400 flex items-center gap-1">
              <Phone className="w-3 h-3" /> +880 1700-000000
            </span>
          </div>

          {/* Messages Container */}
          <div className="p-4 h-72 overflow-y-auto space-y-3 text-xs">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  m.sender === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-2xl ${
                    m.sender === 'user'
                      ? 'bg-emerald-500 text-slate-950 font-semibold rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none'
                  }`}
                >
                  <p className="leading-relaxed">{m.text}</p>
                </div>
                <span className="text-[9px] text-slate-500 mt-1 px-1">{m.time}</span>
              </div>
            ))}
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={inputMsg}
              onChange={(e) => setInputMsg(e.target.value)}
              placeholder="Ask warranty, delivery, stock..."
              className="flex-1 px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-500 text-slate-950 hover:brightness-110 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setChatOpen(!chatOpen)}
        className="px-4 py-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black shadow-2xl shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all flex items-center gap-2 border border-emerald-400"
      >
        <MessageSquare className="w-5 h-5" />
        <span className="text-xs hidden sm:inline">Live Chat</span>
      </button>
    </div>
  );
};
