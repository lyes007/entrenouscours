"use client";

import { useState, useRef, useEffect } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Bonjour 👋 Je suis l'assistant EntreNousCours. Pose-moi tes questions sur le fonctionnement du site, les cours, les demandes ou les échanges.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isOpen, messages]);

  const sendMessage = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmed,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(
          data.error ||
            "Impossible de contacter le chatbot pour le moment. Réessaie un peu plus tard.",
        );
        return;
      }

      const assistantMessage: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer || "Je n'ai pas pu générer de réponse cette fois-ci.",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      setError(
        "Une erreur réseau est survenue. Vérifie ta connexion et réessaie dans quelques instants.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Bouton flottant */}
      <button
        type="button"
        onClick={() => setIsOpen((open) => !open)}
        className="fixed bottom-4 right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-[#4A70A9] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 hover:bg-[#8FABD4]"
        aria-label="Ouvrir le chatbot"
      >
        {isOpen ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 8h10M7 12h6m-6 4h3m2 5a9 9 0 100-18 9 9 0 000 18z"
            />
          </svg>
        )}
      </button>

      {/* Panneau de chat */}
      {isOpen && (
        <div className="fixed bottom-20 right-4 z-40 w-[320px] max-w-[90vw] rounded-3xl border border-black/10 bg-white shadow-2xl shadow-black/20">
          <div className="flex items-center justify-between rounded-t-3xl bg-[#4A70A9] px-4 py-3 text-sm text-white">
            <div>
              <p className="font-semibold">Assistant EntreNousCours</p>
              <p className="text-[11px] text-white/80">
                Questions sur les cours, les demandes et le fonctionnement
              </p>
            </div>
          </div>

          <div className="flex max-h-[360px] flex-col overflow-hidden">
            <div className="flex-1 space-y-2 overflow-y-auto bg-[#EFECE3]/60 px-3 py-3 text-xs">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 ${
                      msg.role === "user"
                        ? "bg-[#4A70A9] text-white"
                        : "bg-white text-black shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white px-3 py-2 text-[11px] text-black/60 shadow-sm">
                    L&apos;assistant réfléchit...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {error && (
              <div className="border-t border-red-100 bg-red-50 px-3 py-2 text-[11px] text-red-700">
                {error}
              </div>
            )}

            <div className="border-t border-black/5 bg-white px-3 py-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Pose ta question..."
                  className="flex-1 rounded-full border border-black/10 bg-[#EFECE3]/60 px-3 py-1.5 text-xs outline-none transition-colors focus:border-[#4A70A9] focus:bg-white"
                />
                <button
                  type="button"
                  onClick={sendMessage}
                  disabled={isLoading || !input.trim()}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-[#4A70A9] text-white transition-colors hover:bg-[#8FABD4] disabled:opacity-50"
                  aria-label="Envoyer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                    className="h-4 w-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5.25 5.25l13.5 6.75-13.5 6.75L6 13.5l9-1.5-9-1.5-.75-5.25z"
                    />
                  </svg>
                </button>
              </div>
              <p className="mt-1 text-[10px] text-black/40">
                Le bot ne remplace pas un conseiller humain, mais il peut t&apos;aider
                à comprendre la plateforme.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


