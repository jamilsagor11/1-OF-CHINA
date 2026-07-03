import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, AlertCircle } from "lucide-react";
import { ChatMessage, Product, CurrencyConfig } from "../types";

interface AiChatProps {
  currency: CurrencyConfig;
  onSelectProduct: (product: Product) => void;
  products: Product[];
}

export default function AiChat({ currency, onSelectProduct, products }: AiChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "initial",
      sender: "bot",
      text: "👋 Welcome to the 1% of China Smart AI Assistant! I can help you find products, understand our local Bangladesh vs. Direct from China shipping, check cash on delivery support, or recommend the best tech gifts! What are you looking for today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg.text,
          chatHistory: messages.slice(-10) // Send recent message history context
        })
      });

      if (!response.ok) throw new Error("API call failed");
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `reply-${Date.now()}`,
          sender: "bot",
          text: data.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      // Local smart lookup fallback in case server has any network issue
      setTimeout(() => {
        const fallbackText = getLocalFallbackReply(userMsg.text);
        setMessages((prev) => [
          ...prev,
          {
            id: `reply-${Date.now()}`,
            sender: "bot",
            text: fallbackText,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }
        ]);
      }, 600);
    } finally {
      setIsTyping(false);
    }
  };

  const getLocalFallbackReply = (text: string): string => {
    const q = text.toLowerCase();
    if (q.includes("delivery") || q.includes("shipping") || q.includes("how long") || q.includes("days")) {
      return "📦 **Fulfillment Information:**\n\n• **Bangladesh Warehouses:** 1-3 business days delivery. Fast & supports Cash on Delivery (COD).\n• **Direct from China:** 25-30 business days delivery with custom clearance and international tracking included.";
    }
    if (q.includes("bestseller") || q.includes("popular") || q.includes("recommend") || q.includes("top")) {
      return "🔥 **Our Top Recommendations:**\n\n1. **Luxury Rose Quartz Eternal Music Box** (2,950 BDT - BD stock)\n2. **Retro Steampunk Mechanical Keyboard** (4,800 BDT - China Direct savings!)\n3. **Ultra HD Nebula Projector** (1,999 BDT - Multi-color sync!)";
    }
    return "I am scanning our active inventories of traditional gifts and premium electronics imports. Feel free to ask about our local Bangladesh stock, China supplier arrivals, or gift ideas!";
  };

  // Check if any product name is mentioned to link directly
  const renderMessageText = (text: string) => {
    // Parse formatting like **bold** & bullets
    const lines = text.split("\n");
    return (
      <div className="space-y-1">
        {lines.map((line, idx) => {
          let renderedLine = line;
          // Simple bold formatting replacement
          const boldRegex = /\*\*(.*?)\*\*/g;
          const matchBold = [...renderedLine.matchAll(boldRegex)];
          
          if (matchBold.length > 0) {
            return (
              <p key={idx} className="text-sm leading-relaxed">
                {renderedLine.split(/\*\*.*?\*\*/).reduce((acc: any[], part, i) => {
                  acc.push(part);
                  if (matchBold[i]) {
                    acc.push(
                      <strong key={`b-${i}`} className="font-semibold text-slate-900">
                        {matchBold[i][1]}
                      </strong>
                    );
                  }
                  return acc;
                }, [])}
              </p>
            );
          }

          if (line.trim().startsWith("•") || line.trim().startsWith("-")) {
            return (
              <li key={idx} className="ml-4 list-disc text-sm text-slate-700 leading-relaxed">
                {line.replace(/^[•-]\s*/, "")}
              </li>
            );
          }

          return <p key={idx} className="text-sm text-slate-700 leading-relaxed">{line}</p>;
        })}
      </div>
    );
  };

  return (
    <>
      {/* Floating launcher badge button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-[#E53935] hover:bg-red-700 hover:scale-105 transition-all text-white p-4 rounded-full shadow-2xl z-50 flex items-center gap-2 group"
        id="ai-chat-trigger"
        aria-label="Ask AI Assistant"
      >
        <Sparkles className="w-5 h-5 animate-pulse text-yellow-300" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-out font-bold text-xs uppercase tracking-wider whitespace-nowrap">
          AI Product Advisor
        </span>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
      </button>

      {/* Chat Window Box modal style */}
      {isOpen && (
        <div
          className="fixed bottom-24 right-5 w-96 max-w-[95vw] h-[550px] bg-white rounded-2xl border border-slate-200 shadow-2xl z-50 flex flex-col overflow-hidden"
          id="ai-chat-window"
        >
          {/* Header custom design style theme */}
          <div className="bg-[#212121] text-white p-4 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="bg-[#E53935] p-1.5 rounded-lg flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                  1% of China AI
                  <span className="bg-[#00C853]/20 text-[#00C853] text-[9px] font-bold px-1.5 py-0.5 rounded tracking-widest uppercase">
                    GENAI
                  </span>
                </h3>
                <p className="text-[10px] text-zinc-400">Trained on local & direct catalog</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick recommendations filters helper */}
          <div className="bg-slate-50 border-b border-slate-100 p-2 text-[10px] flex gap-1.5 overflow-x-auto whitespace-nowrap custom-scrollbar">
            <span className="text-slate-400 font-medium py-1">Quick asks:</span>
            <button
              onClick={() => {
                setInputText("What are your best gifts for fast delivery in Bangladesh?");
              }}
              className="bg-white border border-slate-200 rounded-full px-2.5 py-1 text-slate-700 hover:border-[#E53935] hover:text-[#E53935] transition-all"
            >
              🇧🇩 Fast local gifts?
            </button>
            <button
              onClick={() => {
                setInputText("Show me high-tech accessories imported from China");
              }}
              className="bg-white border border-slate-200 rounded-full px-2.5 py-1 text-slate-700 hover:border-[#E53935] hover:text-[#E53935] transition-all"
            >
              🇨🇳 China direct tech?
            </button>
            <button
              onClick={() => {
                setInputText("Is Cash on Delivery available for all orders?");
              }}
              className="bg-white border border-slate-200 rounded-full px-2.5 py-1 text-slate-700 hover:border-[#E53935] hover:text-[#E53935] transition-all"
            >
              🚚 Cash on Delivery rules?
            </button>
          </div>

          {/* Messages view */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex gap-2.5 max-w-[85%] ${
                  m.sender === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {m.sender === "bot" && (
                  <div className="w-7 h-7 bg-[#E53935] rounded-full flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                )}
                <div className="flex flex-col">
                  <div
                    className={`p-3 rounded-2xl text-xs ${
                      m.sender === "user"
                        ? "bg-[#E53935] text-white rounded-br-none"
                        : "bg-white text-slate-800 border border-slate-100 shadow-xs rounded-bl-none"
                    }`}
                  >
                    {renderMessageText(m.text)}
                  </div>
                  <span
                    className={`text-[9px] text-slate-400 mt-1 ${
                      m.sender === "user" ? "text-right" : "text-left"
                    }`}
                  >
                    {m.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-2 mr-auto max-w-[85%]">
                <div className="w-7 h-7 bg-slate-200 rounded-full flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-slate-500 animate-bounce" />
                </div>
                <div className="bg-white border border-slate-100 shadow-xs p-3 rounded-2xl rounded-bl-none">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer toolbar */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 border-t border-slate-100 bg-white flex gap-2 items-center"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask about gifts, shipping, discount coupons..."
              className="flex-1 bg-slate-100 border-none outline-none py-2 px-4 rounded-xl text-xs text-slate-800 focus:ring-1 focus:ring-[#E53935]"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="bg-[#212121] text-white p-2.5 rounded-xl hover:bg-[#E53935] disabled:bg-slate-100 disabled:text-slate-400 transition-all flex items-center justify-center"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
